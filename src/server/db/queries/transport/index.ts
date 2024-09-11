"use server";

import { and, eq } from "drizzle-orm";
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

