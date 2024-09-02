"use server"

import { db } from "../.."
import { and, eq } from 'drizzle-orm';
import { shop, shopType } from "../../schema";

export const getAllShops = ()=>{
    return db.query.shop.findMany()
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
  

export const getAllShopTypes = ()=>{
    return db.query.shopType.findMany()
}