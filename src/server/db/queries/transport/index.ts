"use server";

import { and, eq, inArray, sql, SQL } from "drizzle-orm";
import { db } from "../..";
import { InsertDriver, InsertGuide, InsertLanguage, InsertOtherTransport, InsertVehicle } from "../../schemaTypes";
import {
  driver,
  driverLanguage,
  driverVehicle,
  guide,
  guideLanguage,
  otherTransport,
  tenant,
  transportVoucher,
  vehicle
} from "./../../schema";
import { getActiveOrganization } from "~/server/auth";

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

export const getAllDrivers = (tenantId:string) => {
  return db.query.driver.findMany({
    where: eq(driver.tenantId, tenantId),
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

export const getAllGuides = (tenantId:string) => {
  return db.query.guide.findMany({
    where: eq(guide.tenantId, tenantId),
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
  const activeOrg = await getActiveOrganization();
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
    // where: (fields, operators) => operators.eq(fields.type, 'Driver'),
    where: (fields, operators) =>
      operators.eq(operators.sql`LOWER(${fields.type})`, 'driver'),

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

    const hasTenant = driver.tenantId === activeOrg;

    return hasMatchingVehicle && speaksLanguage && hasTenant;
  });

  return filteredDrivers;
};

export const getAllChauffeurByVehicleTypeAndLanguage = async (
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
    // where: (fields, operators) => operators.eq(fields.type, 'chauffeur'),
    where: (fields, operators) =>
      operators.eq(operators.sql`LOWER(${fields.type})`, 'chauffeur'),
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

export const getAllGuidesByLanguage = async (
  languageCode: string,
) => {
  const guides = await db.query.guide.findMany({
    with: {
      languages: {
        with: {
          language: true,
        },
      },
    },
  });

  console.log(guides);

  const filteredGuides = guides.filter((guide) => {

    const speaksLanguage = guide.languages.some(
      (language) => language.language.code === languageCode,
    );

    return speaksLanguage;
  });

  return filteredGuides;
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

export const getGuideByIdQuery = (id: string) => {
  return db.query.guide.findFirst({
    where: eq(guide.id, id),
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

export const getDriverDataById = (id: string) => {
  return db.query.driver.findFirst({
    where: eq(driver.id, id),
    with: {
      city: true,
      vehicles: {
        with: {
          vehicle: true
        }
      },
      languages: {
        with: {
          language: true
        }
      }
    },
  });
}

export const getGuideDataById = (id: string) => {
  return db.query.guide.findFirst({
    where: eq(guide.id, id),
    with: {
      city: true,
      languages: {
        with: {
          language: true
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
  languages: InsertLanguage[],
  tenantId: string
) => {
  try {
    const newDrivers = await db.transaction(async (tx) => {
      const foundTenant = await tx.query.tenant.findFirst({
        where: eq(tenant.id, tenantId),
      });

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      const insertedDriverIds: Array<string> = [];

      for (const currentDriver of drivers) {
        const foundDriver = await tx.query.driver.findFirst({
          where: and(
            eq(driver.tenantId, foundTenant.id),
            eq(driver.cityId, currentDriver.cityId),
            eq(driver.primaryEmail, currentDriver.primaryEmail)
          ),
        });

        if (!foundDriver) {
          const [newDriver] = await tx
            .insert(driver)
            .values({
              ...currentDriver,
              tenantId: foundTenant.id,
            })
            .returning({
              id: driver.id,
            });

          if (!newDriver?.id) {
            throw new Error(`Couldn't add driver: ${currentDriver.name}`);
          }

          const addedVehicles = await tx
            .insert(vehicle)
            .values(
              vehicleData.map((v) => ({
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
              driverId: newDriver.id,
            }))
          );

          // Insert driver language associations
          const driverLanguageLinks = languages.map((lang) => ({
            driverId: newDriver.id,
            languageCode: lang.code,
          }));

          await tx.insert(driverLanguage).values(driverLanguageLinks);

          insertedDriverIds.push(newDriver.id);
        }
      }

      return insertedDriverIds;
    });

    return newDrivers;
  } catch (error: any) {
    console.error("Error in insertDriver:", error?.detail ?? error.message);
    throw error;
  }
};

export const insertGuide = async (
  drivers: InsertGuide[],
  languages: InsertLanguage[],
  tenantId: string
) => {
  try {
    const newGuide = await db.transaction(async (tx) => {
      const foundTenant = await tx.query.tenant.findFirst({
        where: eq(tenant.id, tenantId),
      });

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      for (const currentGuide of drivers) {
        const foundGuide = await tx.query.guide.findFirst({
          where: and(
            eq(driver.tenantId, foundTenant.id),
            eq(driver.cityId, currentGuide.cityId),
            eq(driver.primaryEmail, currentGuide.primaryEmail)
          ),
        });

        if (!foundGuide) {
          const newGuideId = await tx
            .insert(guide)
            .values({
              ...currentGuide,
              tenantId: foundTenant.id,
            })
            .returning({
              id: guide.id,
            });

          if (!newGuideId[0]) {
            throw new Error(`Couldn't add guide: ${currentGuide.name}`);
          }

          const guideLanguageLinks = languages.map((lang: InsertLanguage) => {
            return {
              guideId: newGuideId[0]?.id ?? "",
              languageCode: lang.code,
            };
          });

          await tx.insert(guideLanguage).values(guideLanguageLinks);
          return newGuideId
        }
      }
    });
    return newGuide
  } catch (error: any) {
    console.error("Error in insertGuide:", error?.detail ?? error);
    throw error;
  }
}

export async function updateDriverAndRelatedData(
  driverId: string,
  updatedDriver: InsertDriver | null,
  updatedVehicles: InsertVehicle[],
  updatedLanguages: InsertLanguage[],
  tenantId: string
) {
  console.log(driverId);
  console.log(updatedDriver);

  if (!updatedDriver) {
    throw new Error("Please provide updated data");
  }

  // Begin a transaction
  const updated = await db.transaction(async (trx) => {
    // Update the driver
    const updatedDriverResult = await trx
      .update(driver)
      .set({
        name: updatedDriver.name,
        primaryEmail: updatedDriver.primaryEmail,
        primaryContactNumber: updatedDriver.primaryContactNumber,
        streetName: updatedDriver.streetName,
        province: updatedDriver.province,
        type: updatedDriver.type,
        feePerKM: updatedDriver.feePerKM,
        feePerDay: updatedDriver.feePerDay,
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

    // Update related vehicles & languages safely
    // const updatedVehiclesData =
    //   (await updateDriverVehicles(trx, driverId, updatedVehicles, tenantId)) || [];

    const updatedLanguagesData =
      (await updateDriverLanguages(trx, driverId, updatedLanguages)) || [];

    return { updatedDriverResult };
  });

  console.log(updated);
  return updated;
}

export async function updateDriverLanguages(
  trx: any,
  driverId: string,
  newLanguagesList: InsertLanguage[]
) {
  if (newLanguagesList.length === 0) {
    return []; // Return empty array to avoid transaction failure
  }

  // Remove existing language relationships
  await trx.delete(driverLanguage).where(eq(driverLanguage.driverId, driverId)).execute();

  // Insert new languages
  const updatedLanguages = await trx
    .insert(driverLanguage)
    .values(
      newLanguagesList.map((language) => ({
        driverId,
        languageCode: language.code,
      }))
    )
    .returning({ id: driverLanguage.languageCode });

  return updatedLanguages;
}

// export async function updateDriverVehicles(
//   trx: any,
//   driverId: string,
//   newVehiclesList: InsertVehicle[],
//   tenantId: string
// ) {
//   if (newVehiclesList.length === 0) {
//     return []; // Prevent transaction failure due to empty updates
//   }

//   // Separate existing and new vehicles
//   const existingVehicles = newVehiclesList.filter(
//     (vehicle) => vehicle.id != null && vehicle.id !== ""
//   );
//   const newVehicles = newVehiclesList.filter(
//     (vehicle) => vehicle.id == null || vehicle.id === ""
//   );

//   // Update existing vehicles
//   if (existingVehicles.length > 0) {
//     await Promise.all(
//       existingVehicles.map(async (vehicleToUpdate) => {
//         await trx
//           .update(vehicle)
//           .set({
//             vehicleType: vehicleToUpdate.vehicleType,
//             numberPlate: vehicleToUpdate.numberPlate,
//             seats: vehicleToUpdate.seats,
//             make: vehicleToUpdate.make,
//             model: vehicleToUpdate.model,
//             year: vehicleToUpdate.year,
//             revenueLicense: vehicleToUpdate.revenueLicense,
//           })
//           .where(eq(vehicle.id, vehicleToUpdate.id!))
//           .execute();
//       })
//     );
//   }

//   const insertedVehicleIds: { id: string }[] = [];

//   // Insert new vehicles and ensure correct transaction flow
//   if (newVehicles.length > 0) {
//     for (const vehicleToInsert of newVehicles) {
//       try {
//         // Insert new vehicle
//         const [newVehicle] = await trx
//           .insert(vehicle)
//           .values({
//             vehicleType: vehicleToInsert.vehicleType,
//             numberPlate: vehicleToInsert.numberPlate,
//             seats: vehicleToInsert.seats,
//             make: vehicleToInsert.make,
//             model: vehicleToInsert.model,
//             year: vehicleToInsert.year,
//             revenueLicense: vehicleToInsert.revenueLicense,
//             tenantId: tenantId,
//           })
//           .returning({ id: vehicle.id });

//         if (!newVehicle || !newVehicle.id) {
//           throw new Error("Vehicle insertion failed: No ID returned");
//         }

//         // Insert mapping into driverVehicle table
//         await trx.insert(driverVehicle).values({
//           driverId,
//           vehicleId: newVehicle.id,
//         });

//         insertedVehicleIds.push(newVehicle);
//       } catch (error) {
//         console.error("Error inserting vehicle:", error);
//         throw new Error("Failed to insert new vehicle"); // Ensures transaction rollback
//       }
//     }
//   }

//   return insertedVehicleIds;
// }



// export async function updateDriverAndRelatedData(
//   driverId: string,
//   updatedDriver: InsertDriver | null,
//   updatedVehicles: InsertVehicle[],
//   updatedLanguages: InsertLanguage[],
//   tenantId: string
// ) {
//   console.log(driverId);
//   console.log(updatedDriver);

//   // Begin a transaction
//   const updated = await db.transaction(async (trx) => {
//     // Update the driver
//     if (!updatedDriver) {
//       throw new Error("Please provide updated data")
//     }
//     const updatedDriverResult = await trx
//       .update(driver)
//       .set({
//         name: updatedDriver.name,
//         primaryEmail: updatedDriver.primaryEmail,
//         primaryContactNumber: updatedDriver.primaryContactNumber,
//         streetName: updatedDriver.streetName,
//         province: updatedDriver.province,
//         type: updatedDriver.type,
//         feePerKM: updatedDriver.feePerKM,
//         feePerDay: updatedDriver.feePerDay,
//         fuelAllowance: updatedDriver.fuelAllowance,
//         accommodationAllowance: updatedDriver.accommodationAllowance,
//         mealAllowance: updatedDriver.mealAllowance,
//         driversLicense: updatedDriver.driversLicense,
//         guideLicense: updatedDriver.guideLicense,
//         insurance: updatedDriver.insurance,
//         contactNumber: updatedDriver.contactNumber,
//         cityId: updatedDriver.cityId,
//       })
//       .where(eq(driver.id, driverId))
//       .returning({ updatedId: driver.id });

//     if (updatedDriverResult.length === 0) {
//       throw new Error(`Driver with id ${driverId} not found.`);
//     }

//     // Update related vehicles
//     const updatedVehiclesData = await updateDriverVehicles(trx, driverId, updatedVehicles, tenantId);

//     //Update related languages
//     const updatedLanguagesData = await updateDriverLanguages(trx, driverId, updatedLanguages);

//     return { updatedDriverResult };
//   });

//   console.log(updated);
//   return updated;
// }

// export async function updateDriverLanguages(
//   trx: any,
//   driverId: string,
//   newLanguagesList: InsertLanguage[]
// ) {

//   // If there are no languages to update, return early
//   if (newLanguagesList.length === 0) {
//     return [];
//   }

//   // const existingLanguages = await trx.driverLanguage.query.findMany({
//   //   where: eq(driverLanguage.driverId, driverId),
//   // });

//   // Remove existing language relationships
//   await trx.delete(driverLanguage).where(eq(driverLanguage.driverId, driverId)).execute();

//   // Update language records
//   const updatedLanguages = await trx
//     .insert(driverLanguage)
//     .values(
//       newLanguagesList.map((language) => ({
//         driverId,
//         languageCode: language.code,
//       }))
//     );

//   return updatedLanguages;

// }

// export async function updateDriverVehicles(
//   trx: any,
//   driverId: string,
//   newVehiclesList: InsertVehicle[],
//   tenantId: string
// ) {
//   // If there are no vehicles to update, return early
//   if (newVehiclesList.length === 0) {
//     return [];
//   }

//   // Correct filtering logic
//   const existingVehicles = newVehiclesList.filter(
//     (vehicle) => vehicle.id != null && vehicle.id !== ""
//   );
//   const newVehicles = newVehiclesList.filter(
//     (vehicle) => vehicle.id == null || vehicle.id === ""
//   );

//   // Update existing vehicles
//   if (existingVehicles.length > 0) {
//     await Promise.all(
//       existingVehicles.map((vehicleToUpdate) =>
//         trx
//           .update(vehicle)
//           .set({
//             vehicleType: vehicleToUpdate.vehicleType,
//             numberPlate: vehicleToUpdate.numberPlate,
//             seats: vehicleToUpdate.seats,
//             make: vehicleToUpdate.make,
//             model: vehicleToUpdate.model,
//             year: vehicleToUpdate.year,
//             revenueLicense: vehicleToUpdate.revenueLicense,
//           })
//           .where(eq(vehicle.id, vehicleToUpdate.id!))
//           .execute()
//       )
//     );
//   }

//   // Insert new vehicles
//   let insertedVehicleIds: { id: string }[] = [];
//   if (newVehicles.length > 0) {
//     insertedVehicleIds = await Promise.all(
//       newVehicles.map(async (vehicleToInsert) => {
//         const [newVehicle] = await trx
//           .insert(vehicle)
//           .values({
//             vehicleType: vehicleToInsert.vehicleType,
//             numberPlate: vehicleToInsert.numberPlate,
//             seats: vehicleToInsert.seats,
//             make: vehicleToInsert.make,
//             model: vehicleToInsert.model,
//             year: vehicleToInsert.year,
//             revenueLicense: vehicleToInsert.revenueLicense,
//             tenantId: tenantId,
//           })
//           .returning({ id: vehicle.id });

//         await trx.insert(driverVehicle).values({
//           driverId,
//           vehicleId: newVehicle.id,
//         });

//         return newVehicle;
//       })
//     );
//   }

//   // Return inserted vehicle IDs for reference
//   return insertedVehicleIds;
// }

export async function updateDriverVehicles(
  driverId: string,
  newVehiclesList: InsertVehicle[],
  tenantId: string
) {
  if (newVehiclesList.length === 0) {
    return []; // Prevent execution if no vehicles are provided
  }

  // Get currently associated vehicles for the driver
  const currentVehicleRelations = await db
    .select({ vehicleId: driverVehicle.vehicleId })
    .from(driverVehicle)
    .where(eq(driverVehicle.driverId, driverId));

  const currentVehicleIds = currentVehicleRelations.map((v) => v.vehicleId);

  // Separate vehicles into categories
  const newVehicleIds = newVehiclesList.map((v) => v.id).filter((id) => id); // IDs of vehicles in the request
  const vehiclesToDelete = currentVehicleIds.filter((id) => !newVehicleIds.includes(id)); // Vehicles to be removed

  const existingVehicles = newVehiclesList.filter((vehicle) => vehicle.id && vehicle.id !== "");
  const newVehicles = newVehiclesList.filter((vehicle) => !vehicle.id || vehicle.id === "");

  // Delete removed vehicles and their relations
  if (vehiclesToDelete.length > 0) {
    await db.delete(driverVehicle).where(inArray(driverVehicle.vehicleId, vehiclesToDelete));
    await db.delete(vehicle).where(inArray(vehicle.id, vehiclesToDelete));
  }

  // Update existing vehicles
  if (existingVehicles.length > 0) {
    await Promise.all(
      existingVehicles.map(async (vehicleToUpdate) => {
        await db
          .update(vehicle)
          .set({
            vehicleType: vehicleToUpdate.vehicleType,
            numberPlate: vehicleToUpdate.numberPlate,
            seats: vehicleToUpdate.seats,
            make: vehicleToUpdate.make,
            model: vehicleToUpdate.model,
            year: vehicleToUpdate.year,
            revenueLicense: vehicleToUpdate.revenueLicense,
          })
          .where(eq(vehicle.id, vehicleToUpdate.id!))
          .execute();
      })
    );
  }

  const insertedVehicleIds: { id: string }[] = [];

  // Insert new vehicles
  if (newVehicles.length > 0) {
    for (const vehicleToInsert of newVehicles) {
      try {
        // Insert new vehicle
        const [newVehicle] = await db
          .insert(vehicle)
          .values({
            vehicleType: vehicleToInsert.vehicleType,
            numberPlate: vehicleToInsert.numberPlate,
            seats: vehicleToInsert.seats,
            make: vehicleToInsert.make,
            model: vehicleToInsert.model,
            year: vehicleToInsert.year,
            revenueLicense: vehicleToInsert.revenueLicense,
            tenantId: tenantId,
          })
          .returning({ id: vehicle.id });

        if (!newVehicle || !newVehicle.id) {
          throw new Error("Vehicle insertion failed: No ID returned");
        }

        // Insert mapping into driverVehicle table
        await db.insert(driverVehicle).values({
          driverId,
          vehicleId: newVehicle.id,
        });

        insertedVehicleIds.push(newVehicle);
      } catch (error) {
        console.error("Error inserting vehicle:", error);
        throw new Error("Failed to insert new vehicle");
      }
    }
  }

  return insertedVehicleIds;
}




export async function updateGuideAndRelatedData(
  guideId: string,
  updatedGuide: InsertGuide | null,
  updatedLanguages: InsertLanguage[]
) {
  console.log(guideId);
  console.log(updatedGuide);

  // Begin a transaction
  const updated = await db.transaction(async (trx) => {
    // Update the driver
    if (!updatedGuide) {
      throw new Error("Please provide updated data")
    }
    const updatedGuideResult = await trx
      .update(guide)
      .set({
        name: updatedGuide.name,
        primaryEmail: updatedGuide.primaryEmail,
        primaryContactNumber: updatedGuide.primaryContactNumber,
        streetName: updatedGuide.streetName,
        province: updatedGuide.province,
        type: updatedGuide.type,
        guideLicense: updatedGuide.guideLicense,
        cityId: updatedGuide.cityId,
      })
      .where(eq(guide.id, guideId))
      .returning({ updatedId: guide.id });

    if (updatedGuideResult.length === 0) {
      throw new Error(`Guide with id ${guideId} not found.`);
    }

    // Update related languages
    // const updatedLanguagesData = await updateGuideLanguages(trx, guideId, updatedLanguages);

    return { updatedGuideResult: updatedGuideResult };
  });

  console.log(updated);
  return updated;
}

async function updateGuideLanguages(
  trx: any,
  guideId: string,
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
      sql`when ${guideLanguage.languageCode} = ${language.code} then ${language}`
    );
    languageCodes.push(language.code);
  }

  languageSqlChunks.push(sql`end)`);
  const finalLanguageSql: SQL = sql.join(languageSqlChunks, sql.raw(' '));

  // Remove existing language relationships
  await trx.delete(guideLanguage).where(eq(guideLanguage.guideId, guideId));

  // Update language records
  await trx
    .update(guideLanguage)
    .set({
      // Assuming language data can be updated as a JSON object
      languageDetails: finalLanguageSql,
    })
    .where(inArray(guideLanguage.languageCode, languageCodes));

  // Reinsert driver-language relationships
  const addedLanguageLinks = await trx
    .insert(guideLanguage)
    .values(
      languageCodes.map((code) => ({
        guideId,
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

export async function deleteGuideCascade(guideId: string) {
  try {
    // Start the transaction
    const deletedGuideId = await db.transaction(async (trx) => {
      await trx
        .delete(guideLanguage)
        .where(eq(guideLanguage.guideId, guideId));

      // Finally, delete the driver
      const deletedGuide = await trx
        .delete(guide)
        .where(eq(guide.id, guideId)).returning({ id: guide.id });

      return deletedGuide;
    });

    console.log("Driver and related data deleted successfully");
    return deletedGuideId;
  } catch (error) {
    console.error("Error deleting driver and related data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}

// Other transport related queries

// Get all other transports
export const getAllOtherTransports = async(tenantId:string) => {
  return db.query.otherTransport.findMany(
    {
      where: eq(otherTransport.tenantId, tenantId),
      with: {
        city: true,
      },
    }
  );
};

// Get other transport by id
export const getOtherTransportById = async(id: string) => {
  return db.query.otherTransport.findFirst({
    where: eq(otherTransport.id, id),
  });
};

// Get other transport by city
export const getOtherTransportByCity = async(cityId: number) => {
  db.query.otherTransport.findMany({
    where: eq(otherTransport.cityId, cityId),
  });
};

//Get other transport by type
export const getOtherTransportByType = async(type: string) => {
  db.query.otherTransport.findMany({
    where: eq(otherTransport.transportMethod, type),
  });
};

//Get other transport by vehicle type
export const getOtherTransportByVehicleType = async(vehicleType: string) => {
  db.query.otherTransport.findMany({
    where: eq(otherTransport.vehicleType, vehicleType),
  });
};

//Get other transport by city, transport method and vehicle type
export const getOtherTransportByCityTransportAndVehicle = async(
  cityId: number,
  transportMethod: string,
  vehicleType: string
) => {
  return db.query.otherTransport.findMany({
    where: and(
      eq(otherTransport.cityId, cityId),
      eq(otherTransport.transportMethod, transportMethod),
      eq(otherTransport.vehicleType, vehicleType)
    ),
  });
};

//Get other transport by city and transport method
export const getOtherTransportByCityAndTransport = async(
  cityId: number,
  transportMethod: string
) => {
  db.query.otherTransport.findMany({
    where: and(
      eq(otherTransport.cityId, cityId),
      eq(otherTransport.transportMethod, transportMethod)
    ),
  });
};

//Insert other transport
export const insertOtherTransport = async (data: Partial<InsertOtherTransport>, tenantId:string) => {
  try {
    const newOtherTransport = await db.transaction(async (trx) => {
      const foundTenant = await trx.query.tenant.findFirst(
        {
          where: eq(tenant.id, tenantId)
        }
      );

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      //Check if same other transport already exists
      const foundOtherTransport = await trx.query.otherTransport.findFirst({
        where: and(
          eq(otherTransport.tenantId, foundTenant.id),
          eq(otherTransport.primaryEmail, data.primaryEmail ?? '')
        ),
      });

      if (foundOtherTransport) {
        throw new Error(`A transport from same vendor with email ${data.primaryEmail} already exists`);
      }

      const insertedOtherTransport = await trx
        .insert(otherTransport)
        .values({
          name: data.name ?? '',
          tenantId: foundTenant.id,
          primaryEmail: data.primaryEmail ?? '',
          primaryContactNumber: data.primaryContactNumber ?? '',
          streetName: data.streetName ?? '',
          cityId: data.cityId ?? 0,
          province: data.province ?? '',
          notes: data.notes ?? '',
          transportMethod: data.transportMethod ?? '',
          vehicleType: data.vehicleType ?? '',
          startLocation: data.startLocation ?? '',
          destination: data.destination ?? '',
          capacity: data.capacity ?? 0,
          price: data.price ?? '0',
        })
        .returning({
          id: otherTransport.id,
        });

      return insertedOtherTransport;
    });

    return newOtherTransport;
  } catch (error: any) {
    console.error("Error in insertOtherTransport:", error?.detail ?? error.message);
    throw error;
  }
};

//Update other transport
export const updateOtherTransport = async (id: string, data: Partial<InsertOtherTransport>) => {
  try {
    const updatedOtherTransport = await db.transaction(async (trx) => {
      const updatedOtherTransport = await trx
        .update(otherTransport)
        .set({
          name: data.name ?? '',
          primaryEmail: data.primaryEmail ?? '',
          primaryContactNumber: data.primaryContactNumber ?? '',
          streetName: data.streetName ?? '',
          cityId: data.cityId ?? 0,
          province: data.province ?? '',
          notes: data.notes ?? '',
          transportMethod: data.transportMethod ?? '',
          vehicleType: data.vehicleType ?? '',
          startLocation: data.startLocation ?? '',
          destination: data.destination ?? '',
          capacity: data.capacity ?? 0,
          price: data.price ?? '0',
        })
        .where(eq(otherTransport.id, id))
        .returning({
          id: otherTransport.id,
        });

      return updatedOtherTransport;
    });

    return updatedOtherTransport;
  } catch (error: any) {
    console.error("Error in updateOtherTransport:", error?.detail ?? error.message);
    throw error;
  }
};

//cascade delete other transport
export const deleteOtherTransportCascade = async (id: string) => {
  try {
    const deletedOtherTransport = await db.transaction(async (trx) => {
      await trx.delete(otherTransport).where(eq(otherTransport.id, id));

      return { id: id };
    });

    return deletedOtherTransport;
  } catch (error: any) {
    console.error("Error in deleteOtherTransportCascade:", error?.detail ?? error.message);
    throw error;
  }
};

// Get all other transport voucher lines by voucher id
export const getOtherTransportVoucherLinesByVoucherId = async (voucherId: string) =>
  db.query.otherTransportVoucherLine.findMany({
    where: eq(transportVoucher.id, voucherId),
  });




