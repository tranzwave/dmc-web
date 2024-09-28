"use server"

import { and, eq } from "drizzle-orm";
import { RestaurantDetails } from "~/app/dashboard/restaurants/add/context";
import { db } from "../..";
import { InsertMeal, InsertRestaurant } from "../../schemaTypes";
import { city, restaurant, restaurantMeal, restaurantVoucher } from './../../schema';


export const getTenantId = () => {
    return db.query.tenant.findFirst()
}

export const getAllCities = (countryCode: string) => {
    return db.query.city.findMany({
        where: eq(city.country, countryCode),
    });
};

export const getCityById = (id: string) => {
    return db.query.city.findFirst({
        where: eq(city.id, Number(id)),
    });
};

export const getAllRestaurantVendors = () => {
    return db.query.restaurant.findMany({
        with: {
            city: true
        }
    })
}

export const getRestaurantVendorById = (id: string) => {
    return db.query.restaurant.findFirst({
        where: eq(restaurant.id, id),
        with: {
            city: true,
            restaurantMeal: {
            }
        }
    })
}

export const getRestaurantVouchersForVendor = (id: string) => {
    return db.query.restaurantVoucher.findMany({
        where: eq(restaurantVoucher.restaurantId, id)
    })
}

export async function deleteRestaurantById(id: string) {
    await db.delete(restaurant)
        .where(eq(restaurant.id, id));
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
        cityId: Number(restaurantData.cityId),
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


export const insertRestaurant = async (
    restaurantDetails: RestaurantDetails[],
) => {
    try {
        const newRestaurants = await db.transaction(async (tx) => {
            const foundTenant = await tx.query.tenant.findFirst();

            if (!foundTenant) {
                throw new Error("Couldn't find any tenant");
            }

            const addedRestaurants = []

            for (const resDetails of restaurantDetails) {
                const { general, mealsOffered } = resDetails;
                const { ...restaurantData } = general;

                // Insert or find existing restaurant
                const foundRestaurant = await tx.query.restaurant.findFirst({
                    where: and(
                        eq(restaurant.tenantId, foundTenant.id),
                        eq(restaurant.name, restaurantData.name),
                        eq(restaurant.streetName, restaurantData.streetName),
                        eq(restaurant.cityId, general.cityId), // Adjust based on how city is referenced
                    ),
                });

                let restaurantId: string;

                if (!foundRestaurant) {
                    const newRestaurants = await tx
                        .insert(restaurant)
                        .values({
                            ...restaurantData,
                            tenantId: foundTenant.id,
                            cityId: general.cityId,
                        })
                        .returning({
                            id: restaurant.id,
                        });

                    if (!newRestaurants[0]) {
                        throw new Error(`Couldn't add restaurant: ${restaurantData.name}`);
                    }

                    restaurantId = newRestaurants[0].id;
                } else {
                    restaurantId = foundRestaurant.id;
                }

                // Process activities for this vendor
                for (const mealsData of mealsOffered) {
                    const { ...mealsOfferedDetails } = mealsData;

                    // Insert restaurant with the found or new restaurantMeal type ID
                    await tx.insert(restaurantMeal).values({
                        ...mealsOfferedDetails,
                        restaurantId: restaurantId,
                    });

                    addedRestaurants.push(restaurantId)
                }
            }

            return addedRestaurants


        });

        return newRestaurants;
    } catch (error) {
        console.error("Error in insertrestaurantVendor:", error);
        throw error;
    }
};

export async function updateRestaurantAndRelatedData(
    restaurantId: string,
    updatedRestaurant: InsertRestaurant | null,
    updatedMeals: InsertMeal[],
) {
    console.log(restaurantId);
    console.log(updatedRestaurant);

    // Begin a transaction
    const updated = await db.transaction(async (trx) => {
        // Update the restaurant
        if (!updatedRestaurant) {
            throw new Error("Please provide updated data")
        }
        const updatedRestaurantResult = await trx
            .update(restaurant)
            .set({
                name: updatedRestaurant.name,
                contactNumber: updatedRestaurant.contactNumber,
                streetName: updatedRestaurant.streetName,
                province: updatedRestaurant.province,
                cityId: updatedRestaurant.cityId,

            })
            .where(eq(restaurant.id, restaurantId))
            .returning({ updatedId: restaurant.id });

        if (updatedRestaurantResult.length === 0) {
            throw new Error(`Restaurant with id ${restaurantId} not found.`);
        }

        // Update related vehicles
        const updatedMealsData = await updateRestaurantMeals(trx, restaurantId, updatedMeals);

        return { updatedDriverResult: updatedRestaurantResult };
    });

    console.log(updated);
    return updated;
}

async function updateRestaurantMeals(
    trx: any,
    restaurantId: string,
    updatedMeals: InsertMeal[]
) {
    // If there are no vehicles to update, return early
    if (updatedMeals.length === 0) {
        return [];
    }
}


export async function deleteRestaurantCascade(restaurantId: string) {
    try {
        // Start the transaction
        const deletedRestaurantId = await db.transaction(async (trx) => {
            // Delete related restaurant-meal relationships
            await trx
                .delete(restaurantMeal)
                .where(eq(restaurantMeal.restaurantId, restaurantId));

            // Finally, delete the restaurant
            const deletedRestaurant = await trx
                .delete(restaurant)
                .where(eq(restaurant.id, restaurantId)).returning({ id: restaurant.id });

            return deletedRestaurant;
        });

        console.log("Restaurant and related data deleted successfully");
        return deletedRestaurantId;
    } catch (error) {
        console.error("Error deleting restaurant and related data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}