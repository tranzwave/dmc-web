"use server"

import { and, eq, inArray, sql, SQL } from 'drizzle-orm';
import { ShopDetails } from '~/app/dashboard/shops/add/context';
import { db } from "../..";
import { city, shop, shopShopType, shopType } from "../../schema";
import { InsertShop, InsertShopType } from '../../schemaTypes';

export const getAllShops = () => {
  return db.query.shop.findMany({
    with: {
      city: true,
      shopShopType:{
        with:{
          shopType: true
      }
    },
  }})
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

export async function updateShopAndRelatedData(
  shopId: string,
  updatedShop: InsertShop | null,
  updatedShopTypes: InsertShopType[]
) {
  console.log(shopId);
  console.log(updatedShop);

  // Begin a transaction
  const updated = await db.transaction(async (trx) => {
    if (!updatedShop) {
      throw new Error("Please provide updated data");
    }

    // Update shop details
    const updatedShopResult = await trx
      .update(shop)
      .set({
        name: updatedShop.name,
        contactNumber: updatedShop.contactNumber,
        streetName: updatedShop.streetName,
        province: updatedShop.province,
        cityId: updatedShop.cityId,
      })
      .where(eq(shop.id, shopId))
      .returning({ id: shop.id });

    if (updatedShopResult.length === 0) {
      throw new Error(`Shop with id ${shopId} not found.`);
    }

    // Update related shop types
    // const updatedShopTypesData = await updatedShopShopTypes(trx, shopId, updatedShopTypes);

    return { updatedShopResult }; // Return both results
  });

  console.log(updated);
  return updated;
}

async function updatedShopShopTypes(
  trx: any,
  name: string,
  updatedShopTypes: InsertShopType[]
) {
  if (updatedShopTypes.length === 0) {
    return [];
  }

  const shopTypeSqlChunks: SQL[] = [];
  const shopIds: string[] = [];

  shopTypeSqlChunks.push(sql`(case`);

  for (const shopType of updatedShopTypes) {
    shopTypeSqlChunks.push(
      sql`when ${shopShopType.shopId} = ${shopType.name} then ${shopType}`
    );
    shopIds.push(shopType.name);
  }

  shopTypeSqlChunks.push(sql`end)`);
  const finalShopTypeSql: SQL = sql.join(shopTypeSqlChunks, sql.raw(' '));

  // Remove existing language relationships
  await trx.delete(shopShopType).where(eq(shopShopType.shopId, name));

  // Update language records
  await trx
    .update(shopShopType)
    .set({
      // Assuming language data can be updated as a JSON object
      shopTypeDetails: finalShopTypeSql,
    })
    .where(inArray(shopShopType.shopId, shopIds));

  // Reinsert driver-language relationships
  const addedShopTypeLinks = await trx
    .insert(shopShopType)
    .values(
      shopIds.map((shopTypeId) => ({
        driverId: name,
        shopId: shopTypeId,
      }))
    );

  return addedShopTypeLinks;
}

export async function deleteShopCascade(shopId: string) {
  try {
    const deletedShopId = await db.transaction(async (trx) => {
      await trx
        .delete(shopShopType)
        .where(eq(shopShopType.shopId, shopId));

      const deletedShop = await trx
        .delete(shop)
        .where(eq(shop.id, shopId)).returning({ id: shop.id });

      return deletedShop;
    });

    console.log("Shop and related data deleted successfully");
    return deletedShopId;
  } catch (error) {
    console.error("Error deleting shop and related data:", error);
    throw error;
  }
}
