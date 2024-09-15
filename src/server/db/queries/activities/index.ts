"use server";

import { and, eq } from "drizzle-orm";
import { ActivityVendorDetails } from "~/app/dashboard/activities/add/context";
import { db } from "../..";
import {
  activity,
  activityType,
  activityVendor,
  activityVoucher,
  city,
} from "./../../schema";

export const getAllCities = (countryCode: string) => {
  return db.query.city.findMany({
    where: eq(city.country, countryCode),
  });
};

export const getAllActivityVendors = () => {
  return db.query.activityVendor.findMany({
    with: {
      city: true,
    },
  });
};

export const getActivityVendorById = (id: string) => {
  return db.query.activityVendor.findFirst({
    where: eq(activityVendor.id, id),
    with: {
      city: true,
    },
  });
};

export const getActivityVouchersForVendor = (id: string) => {
  return db.query.activityVoucher.findMany({
    where: eq(activityVoucher.activityVendorId, id),
  });
};

export const getActivityVendorDataById = (id: string) => {
  return db.query.activityVendor.findFirst({
    where: eq(activityVendor.id, id),
    with: {
      city: true,
      activity:{
        with:{
          activityType:true
        }
      },
      activityVoucher: true,
    },
  });
};



export const getActivitiesByTypeAndCity = async (
  typeId: number,
  cityId: number,
) => {
  // return db.query.activity.findMany({
  //     where: eq(activity.activityType,typeId),
  //     with:{
  //         activityVendor: {
  //             where: eq(activityVendor.cityId, cityId)
  //         }
  //     }
  // })
  console.log(`Type id - ${typeId}`);
  const activitiesData = await db.query.activity
    .findMany({
      where: eq(activity.activityType, typeId),
      with: {
        activityVendor: {
          with: {
            city: true,
          },
        },
      },
    })
    .then((payload) =>
      payload.filter((act) => act.activityVendor.cityId === cityId),
    );

  if (activitiesData) {
    return activitiesData;
  }
  // return db.query.activity.findMany()
};

export const getAllActivityTypes = () => {
  return db.query.activityType.findMany();
};

export const insertActivityVendor = async (
  activityVendorDetails: ActivityVendorDetails[],
) => {
  try {
    const newActivityVendors = await db.transaction(async (tx) => {
      const foundTenant = await tx.query.tenant.findFirst();

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      const addedVendors = []

      for (const vendorDetails of activityVendorDetails) {
        const { general, activities } = vendorDetails;
        const { city, ...vendorData } = general;

        // Insert or find existing activity vendor
        const foundVendor = await tx.query.activityVendor.findFirst({
          where: and(
            eq(activityVendor.tenantId, foundTenant.id),
            eq(activityVendor.name, vendorData.name),
            eq(activityVendor.streetName, vendorData.streetName),
            eq(activityVendor.cityId, general.cityId),
          ),
        });

        let vendorId: string;

        if (!foundVendor) {
          const newVendor = await tx
            .insert(activityVendor)
            .values({
              ...vendorData,
              tenantId: foundTenant.id,
              cityId: general.cityId,
            })
            .returning({
              id: activityVendor.id,
            });

          if (!newVendor[0]) {
            throw new Error(`Couldn't add activity vendor: ${vendorData.name}`);
          }

          vendorId = newVendor[0].id;
        } else {
          vendorId = foundVendor.id;
        }

        // Process activities for this vendor
        for (const activityData of activities) {
          const { typeName, ...activityDetails } = activityData;

          if (!typeName) {
            throw new Error("Error when adding the activity type");
          }
          // Find or insert activity type
          const foundType = await tx.query.activityType.findFirst({
            where: eq(activityType.name, typeName),
          });

          let typeId: number;

          if (!foundType) {
            const newType = await tx
              .insert(activityType)
              .values({ name: typeName })
              .returning({
                id: activityType.id,
              });

            if (!newType[0]) {
              throw new Error(`Couldn't add activity type: ${typeName}`);
            }

            typeId = newType[0].id;
          } else {
            typeId = foundType.id;
          }

          // Insert activity with the found or new activity type ID
          await tx.insert(activity).values({
            ...activityDetails,
            tenantId: foundTenant.id,
            activityVendorId: vendorId,
            activityType: typeId,
          });

          addedVendors.push(vendorId)
        }
      }

      return addedVendors


    });

    return newActivityVendors;
  } catch (error) {
    console.error("Error in insertActivityVendor:", error);
    throw error;
  }
};



export async function deleteActivitytCascade(activityVendorId: string) {
  try {
    // Start the transaction
    const deletedActivityVendorId = await db.transaction(async (trx) => {
      // Delete related activity-activityvendor relationships
      await trx
        .delete(activity)
        .where(eq(activity.activityVendorId, activityVendorId));

      // Finally, delete the activity
      const deletedActivityVendor = await trx
        .delete(activityVendor)
        .where(eq(activityVendor.id, activityVendorId)).returning({ id: activityVendor.id });

      return deletedActivityVendor;
    });

    console.log("Activity and related data deleted successfully");
    return deletedActivityVendorId;
  } catch (error) {
    console.error("Error deleting activity and related data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}
