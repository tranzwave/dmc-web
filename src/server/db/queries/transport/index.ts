"use server";

import { and, eq, inArray, sql, SQL } from "drizzle-orm";
import { db } from "../..";
import {
  driver,
  transportVoucher,
  vehicle,
  language,
  city,
  driverVehicle,
  driverLanguage,
} from "./../../schema";
import { InsertDriver, InsertLanguage, InsertVehicle } from "../../schemaTypes";

export const getAllVehicleTypes = async () => {
  return await db.query.vehicle
    .findMany({
      columns: {
        vehicleType: true,
      },
    })
    .then((vehicles) => {
      const types = vehicles.map((vehicle) => vehicle.vehicleType);

      const uniqueTypes = new Set(types);

      return Array.from(uniqueTypes);
    });
};

export const getAllLanguages = () => {
  return db.query.language.findMany();
};

export const getAllDrivers = () => {
  return db.query.driver.findMany({
    columns: {
      cityId: false,
    },
    with: {
      city: {
        columns: {
          id: false,
        },
      },
    },
  });
};

export const getAllDriversByVehicleTypeAndLanguage = async (
  vehicleType: string,
  languageCode: string,
) => {
  const drivers = await db.query.driver.findMany({
    with: {
      vehicles: {
        with: {
          vehicle: true,
        },
      },
      languages: {
        with: {
          language: true,
        },
      },
    },
  });

  console.log(drivers);

  // Filter drivers based on vehicle type and language code
  const filteredDrivers = drivers.filter((driver) => {
    const hasMatchingVehicle = driver.vehicles.some(
      (vehicle) => vehicle.vehicle.vehicleType === vehicleType,
    );

    const speaksLanguage = driver.languages.some(
      (language) => language.language.code === languageCode,
    );

    return hasMatchingVehicle && speaksLanguage;
  });

  return filteredDrivers;
};

export const getDriverByIdQuery = (id: string) => {
  return db.query.driver.findFirst({
    where: eq(driver.id, id),
    columns: {
      cityId: false,
    },
    with: {
      city: {
        columns: {
          id: false,
        },
      },
    },
  });
};

export const getDriverDataById = (id:string) =>{
  return db.query.driver.findFirst({
    where: eq(driver.id, id),
    with: {
      city: true,
      vehicles: {
        with: {
          vehicle:true
        }
      },
      languages:{
        with:{
          language:true
        }
      }
    },
  });
}

export const getTransportVouchersForDriver = (id: string) => {
  return db.query.transportVoucher.findMany({
    where: eq(transportVoucher.driverId, id),
  });
};

export const insertDriver = async (
  drivers: InsertDriver[],
  vehicleData: InsertVehicle[],
  languages: InsertLanguage[]
) => {
  try {
    const newDriver = await db.transaction(async (tx) => {
      const foundTenant = await tx.query.tenant.findFirst();

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      for (const currentDriver of drivers) {
        const foundDriver = await tx.query.driver.findFirst({
          where: and(
            eq(driver.tenantId, foundTenant.id),
            eq(driver.cityId, currentDriver.cityId),
            eq(driver.primaryEmail, currentDriver.primaryEmail)
          ),
        });

        if (!foundDriver) {
          const newDriverId = await tx
            .insert(driver)
            .values({
              ...currentDriver,
              tenantId: foundTenant.id,
            })
            .returning({
              id: driver.id,
            });

          if (!newDriverId[0]) {
            throw new Error(`Couldn't add driver: ${currentDriver.name}`);
          }

          const addedVehicles = await tx
            .insert(vehicle)
            .values(
              vehicleData.map((v: any) => ({
                ...v,
                tenantId: foundTenant.id,
              }))
            )
            .returning({
              id: vehicle.id,
            });

          if (!addedVehicles.length) {
            throw new Error("Couldn't add vehicles");
          }

          await tx.insert(driverVehicle).values(
            addedVehicles.map((vhcle) => ({
              vehicleId: vhcle.id,
              driverId: newDriverId[0]?.id ?? "",
            }))
          );

          const driverLanguageLinks = languages.map((lang: InsertLanguage) => {
            return {
              driverId: newDriverId[0]?.id ?? "",
              languageCode: lang.code,
            };
          });

          await tx.insert(driverLanguage).values(driverLanguageLinks);
          return newDriverId
        }
      }
    });
    return newDriver
  } catch (error:any) {
    console.error("Error in insertDriver:", error?.detail ?? error);
    throw error;
  }
};

export async function updateDriverAndRelatedData(
  driverId: string,
  updatedDriver: InsertDriver | null,
  updatedVehicles: InsertVehicle[],
  updatedLanguages: InsertLanguage[]
) {
  console.log(driverId);
  console.log(updatedDriver);

  // Begin a transaction
  const updated = await db.transaction(async (trx) => {
    // Update the driver
    if(!updatedDriver){
      throw new Error("Please provide updated data")
    }
    const updatedDriverResult = await trx
      .update(driver)
      .set({
        name: updatedDriver.name,
        primaryEmail: updatedDriver.primaryEmail,
        primaryContactNumber: updatedDriver.primaryContactNumber,
        streetName: updatedDriver.streetName,
        province: updatedDriver.province,
        isGuide: updatedDriver.isGuide,
        feePerKM: updatedDriver.feePerKM,
        fuelAllowance: updatedDriver.fuelAllowance,
        accommodationAllowance: updatedDriver.accommodationAllowance,
        mealAllowance: updatedDriver.mealAllowance,
        driversLicense: updatedDriver.driversLicense,
        guideLicense: updatedDriver.guideLicense,
        insurance: updatedDriver.insurance,
        contactNumber: updatedDriver.contactNumber,
        cityId: updatedDriver.cityId,
      })
      .where(eq(driver.id, driverId))
      .returning({ updatedId: driver.id });

    if (updatedDriverResult.length === 0) {
      throw new Error(`Driver with id ${driverId} not found.`);
    }

    // Update related vehicles
    // const updatedVehiclesData = await updateDriverVehicles(trx, driverId, updatedVehicles);

    // Update related languages
    // const updatedLanguagesData = await updateDriverLanguages(trx, driverId, updatedLanguages);

    return { updatedDriverResult };
  });

  console.log(updated);
  return updated;
}

// Separate function to update vehicles associated with a driver

// Function to update vehicles associated with a driver

async function updateDriverVehicles(
  trx: any,
  driverId: string,
  updatedVehicles: InsertVehicle[]
) {
  // If there are no vehicles to update, return early
  if (updatedVehicles.length === 0) {
    return [];
  }

  const vehicleSqlChunks: SQL[] = [];
  const vehicleIds: string[] = [];

  vehicleSqlChunks.push(sql`(case`);

  for (const vehicleData of updatedVehicles) {
    vehicleSqlChunks.push(
      sql`when ${vehicle.id} = ${vehicleData.id} then json_build_object(
        'tenantId', ${vehicleData.tenantId},
        'vehicleType', ${vehicleData.vehicleType},
        'numberPlate', ${vehicleData.numberPlate},
        'seats', ${vehicleData.seats},
        'make', ${vehicleData.make},
        'model', ${vehicleData.model},
        'year', ${vehicleData.year},
        'revenueLicense', ${vehicleData.revenueLicense}
      )`
    );
    vehicleIds.push(vehicleData.id ?? "");
  }

  vehicleSqlChunks.push(sql`end)`);
  const finalVehicleSql: SQL = sql.join(vehicleSqlChunks, sql.raw(' '));

  // Delete existing relationships
  await trx.delete(driverVehicle).where(eq(driverVehicle.driverId, driverId));

  // Update vehicle records
  await trx
    .update(vehicle)
    .set({
      // Set the fields individually
      tenantId: finalVehicleSql,
      vehicleType: finalVehicleSql,
      numberPlate: finalVehicleSql,
      seats: finalVehicleSql,
      make: finalVehicleSql,
      model: finalVehicleSql,
      year: finalVehicleSql,
      revenueLicense: finalVehicleSql,
    })
    .where(inArray(vehicle.id, vehicleIds));

  // Reinsert driver-vehicle relationships
  await trx.insert(driverVehicle).values(
    updatedVehicles.map((vehicleData) => ({
      vehicleId: vehicleData.id,
      driverId,
    }))
  );

  return vehicleIds;
}




// Separate function to update languages associated with a driver
async function updateDriverLanguages(
  trx: any,
  driverId: string,
  updatedLanguages: InsertLanguage[]
) {
  // If there are no languages to update, return early
  if (updatedLanguages.length === 0) {
    return [];
  }

  const languageSqlChunks: SQL[] = [];
  const languageCodes: string[] = [];

  languageSqlChunks.push(sql`(case`);

  for (const language of updatedLanguages) {
    languageSqlChunks.push(
      sql`when ${driverLanguage.languageCode} = ${language.code} then ${language}`
    );
    languageCodes.push(language.code);
  }

  languageSqlChunks.push(sql`end)`);
  const finalLanguageSql: SQL = sql.join(languageSqlChunks, sql.raw(' '));

  // Remove existing language relationships
  await trx.delete(driverLanguage).where(eq(driverLanguage.driverId, driverId));

  // Update language records
  await trx
    .update(driverLanguage)
    .set({
      // Assuming language data can be updated as a JSON object
      languageDetails: finalLanguageSql,
    })
    .where(inArray(driverLanguage.languageCode, languageCodes));

  // Reinsert driver-language relationships
  const addedLanguageLinks = await trx
    .insert(driverLanguage)
    .values(
      languageCodes.map((code) => ({
        driverId,
        languageCode: code,
      }))
    );

  return addedLanguageLinks;
}




export async function deleteDriverCascade(driverId: string) {
  try {
    // Start the transaction
    const deletedDriverId = await db.transaction(async (trx) => {
      // Delete related driver-vehicle relationships
      await trx
        .delete(driverVehicle)
        .where(eq(driverVehicle.driverId, driverId));

      // Delete related driver-language relationships
      await trx
        .delete(driverLanguage)
        .where(eq(driverLanguage.driverId, driverId));

      // Finally, delete the driver
      const deletedDriver = await trx
        .delete(driver)
        .where(eq(driver.id, driverId)).returning({ id: driver.id });

      return deletedDriver;
    });

    console.log("Driver and related data deleted successfully");
    return deletedDriverId;
  } catch (error) {
    console.error("Error deleting driver and related data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}
