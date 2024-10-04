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


export const insertShop = async (
  shopDetails: ShopDetails[],
) => {
  try {
    const newShops = await db.transaction(async (tx) => {
      const foundTenant = await tx.query.tenant.findFirst();

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      const addedVendors = [];

      for (const shopsDetails of shopDetails) {
        const { general, shopTypes } = shopsDetails;
        const { city, ...shopData } = general;

        // Insert or find existing shop vendor
        const foundVendor = await tx.query.shop.findFirst({
          where: and(
            eq(shop.tenantId, foundTenant.id),
            eq(shop.name, shopData.name),
            eq(shop.streetName, shopData.streetName),
            eq(shop.cityId, general.cityId),
          ),
        });

        let vendorId: string;

        if (!foundVendor) {
          const newVendor = await tx
            .insert(shop)
            .values({
              ...shopData,
              tenantId: foundTenant.id,
              cityId: general.cityId,
            })
            .returning({
              id: shop.id,
            });

          if (!newVendor[0]) {
            throw new Error(`Couldn't add shop: ${shopData.name}`);
          }

          vendorId = newVendor[0].id;
        } else {
          vendorId = foundVendor.id;
        }

        // Process activities for this vendor
        for (const shopTypeData of shopTypes) {
          const { shopTypeId, ...shopTypeDetails } = shopTypeData;

          if (!shopTypeId) {
            throw new Error("Error when adding the shop type");
          }

          // Find or insert shop type
          const foundType = await tx.query.shopType.findFirst({
            where: eq(shopType.id, shopTypeId),
          });

          let typeId: number;

          if (!foundType) {
            const newType = await tx
              .insert(shopType)
              .values({ name: shopTypeDetails.shopId })
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

          // Insert into shop_shop_type with the found or new type ID
          await tx.insert(shopShopType).values({
            shopId: vendorId,
            shopTypeId: typeId,
          });

          addedVendors.push(vendorId);
        }
      }

      return addedVendors;
    });

    return newShops;
  } catch (error) {
    console.error("Error in insertShop:", error);
    throw error;
  }
};



// export const insertShop = async (
//   shopDetails: ShopDetails[],
// ) => {
//   try {
//     const newShops = await db.transaction(async (tx) => {
//       const foundTenant = await tx.query.tenant.findFirst();

//       if (!foundTenant) {
//         throw new Error("Couldn't find any tenant");
//       }

//       const addedVendors = []

//       for (const shopsDetails of shopDetails) {
//         const { general, shopTypes } = shopsDetails;
//         const { city, ...shopData } = general;

//         // Insert or find existing activity vendor
//         const foundVendor = await tx.query.shop.findFirst({
//           where: and(
//             eq(shop.tenantId, foundTenant.id),
//             eq(shop.name, shopData.name),
//             eq(shop.streetName, shopData.streetName),
//             eq(shop.cityId, general.cityId),
//           ),
//         });

//         let vendorId: string;

//         if (!foundVendor) {
//           const newVendor = await tx
//             .insert(shop)
//             .values({
//               ...shopData,
//               tenantId: foundTenant.id,
//               cityId: general.cityId,
//             })
//             .returning({
//               id: shop.id,
//             });

//           if (!newVendor[0]) {
//             throw new Error(`Couldn't add shop: ${shopData.name}`);
//           }

//           vendorId = newVendor[0].id;
//         } else {
//           vendorId = foundVendor.id;
//         }

//         // Process activities for this vendor
//         for (const shopTypeData of shopTypes) {
//           const { shopTypeId, ...shopTypeDetails } = shopTypeData;

//           if (!shopTypeId) {
//             throw new Error("Error when adding the shop type");
//           }
//           // Find or insert activity type
//           const foundType = await tx.query.shopType.findFirst({
//             where: eq(shopShopType.shopTypeId, shopTypeId),
//           });

//           let typeId: number;

//           if (!foundType) {
//             const newType = await tx
//               .insert(shopShopType)
//               .values({ shopTypeId: shopTypeId })
//               .returning({
//                 id: shopShopType.shopId,
//               });

//             if (!newType[0]) {
//               throw new Error(`Couldn't add shop type: ${shopTypeId}`);
//             }

//             shopTypeId = newType[0].id;
//           } else {
//             typeId = foundType.id;
//           }

//           // Insert activity with the found or new activity type ID
//           await tx.insert(shop).values({
//             ...shopTypeDetails,
//             shopTypeId: shopTypeId,
//             shopId: shopType.id,
//           });

//           addedVendors.push(vendorId)
//         }
//       }

//       return addedVendors


//     });

//     return newShops;
//   } catch (error) {
//     console.error("Error in insertActivityVendor:", error);
//     throw error;
//   }
// };