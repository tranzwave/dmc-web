import { tenant, city, shopType,shop, shopShopType } from './../schema';
import { and, eq } from "drizzle-orm";
import { DB } from "..";
// import {
//   city,
//   tenant,
//   activityVendor,
//   activity,
//   activityType,
// } from "../schema";
// import vendors from "./data/activities.json";
import shops from "./data/shops.json"

export default async function seed(db: DB) {
  // Fetch tenants
  const foundTenant = await db.query.tenant.findFirst();

  if (!foundTenant) {
    throw new Error("No tenants found");
  }

  // Fetch or create cities
  const citiesMap = new Map<string, { id: number; name: string }>();
  for (const currentShop of shops) {
    const cityName = currentShop.city;
    if (!citiesMap.has(cityName)) {
      const foundCity = await db.query.city.findFirst({
        where: eq(city.name, cityName),
      });

      if (!foundCity) {
        const newCity = await db
          .insert(city)
          .values({
            name: cityName,
            country: foundTenant.country,
          })
          .returning({
            id: city.id,
            name: city.name,
          });

        if (!newCity[0]) {
          throw new Error("Couldn't add new city " + cityName);
        }
        citiesMap.set(cityName, newCity[0]);
      } else {
        citiesMap.set(cityName, foundCity);
      }
    }
  }

  // Fetch or create shop type
  const shopTypesMap = new Map<string, { id: number, name: string }>();
  for (const currentShop of shops) {
      for (const t of currentShop.shopTypes) {
          if (!shopTypesMap.has(t.name)) {
              const foundShopType = await db.query.shopType.findFirst({
                  where: eq(shopType.name, t.name),
              });

              if (!foundShopType) {
                  const newShopType = await db.insert(shopType).values({
                      name: t.name
                  }).returning({
                      id: shopType.id,
                      name: shopType.name
                  });
                  if(!newShopType[0]){
                      throw new Error("Couldn't add new activity ")
                  }
                  shopTypesMap.set(t.name, newShopType[0]);
              } else {
                  shopTypesMap.set(t.name, foundShopType);
              }
          }
      }
  }

      // Process shops and types
      for (const currentShop of shops) {
        const cityObject = citiesMap.get(currentShop.city);
        if (!cityObject) {
            throw new Error("City not found for driver: " + currentShop.city);
        }

        const foundShop = await db.query.shop.findFirst({
            where: and(
                eq(shop.tenantId, foundTenant.id),
                eq(shop.cityId, cityObject.id),
                eq(shop.contactNumber, currentShop.contactNumber)
            ),
        });

        if (!foundShop) {
            const newShopId = await db.insert(shop).values({
                ...currentShop,
                tenantId: foundTenant.id,
                cityId: cityObject.id,
            }).returning({
                id: shop.id,
            });

            if (!newShopId[0]) {
                throw new Error(`Couldn't add driver: ${currentShop.name}`);
            }

          //Link shops with shop types
          await db.insert(shopShopType).values(
            currentShop.shopTypes.map((t) => ({
              shopId: newShopId[0]?.id ?? "",
              shopTypeId: shopTypesMap.get(t.name)?.id ?? 0
            }))
          );            
        }
    }


}
