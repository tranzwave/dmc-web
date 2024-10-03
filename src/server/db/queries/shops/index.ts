"use server"

import { eq } from 'drizzle-orm';
import { db } from "../..";
import { city, shop } from "../../schema";

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