"use server"

import { and, eq } from 'drizzle-orm';
import { ShopDetails } from '~/app/dashboard/shops/add/context';
import { db } from "../..";
import { city, shop, shopShopType, shopType } from "../../schema";

export const getAllShops = () => {
  return db.query.shop.findMany({
    with: {
      city: true,
    },
  })
}

export const getShopsByTypeAndCity = async (typeId: number, cityId: number) => {
  console.log(`Type id - ${typeId}`);

  // Fetch shops data by city ID and include related shop types and city information
  const shopsData = await db.query.shop.findMany({
    where: eq(shop.cityId, cityId),
    with: {
      shopTypes: {
        with: {
          shopType: true,
        },
      },
      city: true,
    },
  });

  // Filter shops to only include those with the specified shop type
  const filteredShopsData = shopsData.filter((shop) =>
    shop.shopTypes.some((type) => type.shopTypeId === typeId)
  );

  return filteredShopsData;
};


export const getAllShopTypes = () => {
  return db.query.shopType.findMany()
}

export const getShopDataById = (id: string) => {
  return db.query.shop.findFirst({
    where: eq(shop.id, id),
    with: {
      city: true,
      shopTypes: {
        with: {
          shopType: true
        }
      },
      shopVouchers: true,
    },
  });
};

export const getAllCities = (countryCode: string) => {
  return db.query.city.findMany({
    where: eq(city.country, countryCode),
  });
};


export const insertShop = async (shopDetails: ShopDetails[]) => {
  try {
    const newShops = await db.transaction(async (tx) => {
      const foundTenant = await tx.query.tenant.findFirst();

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      const addedShops: string[] = [];
      for (const details of shopDetails) {
        const { general } = details;
        const { city, ...shopData } = general;
        const shopTypes = general.shopTypes ?? [];

        // Insert or find existing shop vendor
        const foundShop = await tx.query.shop.findFirst({
          where: and(
            eq(shop.tenantId, foundTenant.id),
            eq(shop.name, shopData.name),
            eq(shop.streetName, shopData.streetName),
            eq(shop.cityId, general.cityId),
          ),
        });

        let shopId: string;

        if (!foundShop) {
          const newShop = await tx
            .insert(shop)
            .values({
              ...shopData,
              tenantId: foundTenant.id,
              cityId: general.cityId,
            })
            .returning({
              id: shop.id,
            });

          if (!newShop[0]) {
            throw new Error(`Couldn't add shop: ${shopData.name}`);
          }

          shopId = newShop[0].id;
        } else {
          shopId = foundShop.id;
        }

        for (const shopTypeData of shopTypes) {
          const { id: shopTypeId, ...shopTypeDetails } = shopTypeData;

          if (!shopTypeId) {
            throw new Error("Error when adding the shop type");
          }

          const foundType = await tx.query.shopType.findFirst({
            where: eq(shopType.id, shopTypeId),
          });

          let typeId: number;

          if (!foundType) {
            const newType = await tx
              .insert(shopType)
              .values({ name: shopTypeDetails.name })
              .returning({
                id: shopType.id,
              });

            if (!newType[0]) {
              throw new Error(`Couldn't add shop type: ${shopTypeId}`);
            }

            typeId = newType[0].id;
          } else {
            typeId = foundType.id;
          }

          const existingRelation = await tx.query.shopShopType.findFirst({
            where: and(eq(shopShopType.shopId, shopId), eq(shopShopType.shopTypeId, typeId)),
          });

          if (!existingRelation) {
            try {
              await tx.insert(shopShopType).values({
                shopId: shopId,
                shopTypeId: typeId,
              });
              console.log(`Inserted into shop_shop_type: shopId = ${shopId as string}, shopTypeId = ${typeId as number}`); // Ensure types are known
            } catch (error) {
              console.error(`Error inserting into shop_shop_type: ${error as string}`); // Ensure the error is a string
            }
          } else {
            console.log(`Relation already exists for shopId = ${shopId as string}, shopTypeId = ${typeId as number}`); // Ensure types are known
          }
        }

        addedShops.push(shopId);
      }

      return addedShops;
    });

    return newShops;
  } catch (error) {
    console.error("Error in insertShop:", error as string); // Ensure the error is a string
    throw error;
  }
};



export async function deleteShopCascade(shopId: string) {
  try {
    // Start the transaction
    const deletedShopId = await db.transaction(async (trx) => {
      // Delete related activity-activityvendor relationships
      await trx
        .delete(shopShopType)
        .where(eq(shopShopType.shopId, shopId));

      // Finally, delete the activity
      const deletedShop = await trx
        .delete(shop)
        .where(eq(shop.id, shopId)).returning({ id: shop.id });

      return deletedShop;
    });

    console.log("Shop and related data deleted successfully");
    return deletedShopId;
  } catch (error) {
    console.error("Error deleting shop and related data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}

