"use server"

import { eq } from "drizzle-orm";
import { db } from "../..";
import { city, restaurant, restaurantMeal } from './../../schema';

export const getTenantId = () => {
    return db.query.tenant.findFirst()
}


export const getAllCities = () => {
    return db.query.city.findMany()
}

export const getCityById = (id: string) => {
    return db.query.city.findFirst({
        where: eq(city.id, id),
    });
};

export const getAllRestaurants = () => {
    return db.query.restaurant.findMany({
        with: {
            city: true
        }
    })
}

export const saveRestaurant = async (restaurantData: {
    name: string;
    streetName: string;
    cityId: string;
    tenantId: string;
    province: string;
    primaryContactNumber: string;
    mealType: string;
    startTime: string;
    endTime: string;
}) => {
    const insertedRestaurants = await db.insert(restaurant).values({
        name: restaurantData.name,
        streetName: restaurantData.streetName,
        province: restaurantData.province,
        contactNumber: restaurantData.primaryContactNumber,
        cityId: restaurantData.cityId,
        tenantId: restaurantData.tenantId,
    }).returning();

    const newRestaurant = insertedRestaurants[0];

    if (!newRestaurant) {
        throw new Error("Failed to insert restaurant data");
    }

    // Use the generated restaurant ID to insert the meal data
    return await db.insert(restaurantMeal).values({
        restaurantId: newRestaurant.id, // Insert the restaurant ID
        mealType: restaurantData.mealType,
        startTime: restaurantData.startTime,
        endTime: restaurantData.endTime,
    }).returning(); // Optionally return the inserted meal data
};