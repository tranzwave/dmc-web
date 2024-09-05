"use server"

import { eq } from 'drizzle-orm';
import { db } from "../..";
import { city } from './../../schema';

export const getAllCities = (countryCode: string) => {
    return db.query.city.findMany({
        where: eq(city.country, countryCode)
    })
}

export const getAllRestaurants = () => {
    return db.query.restaurant.findMany({
        with: {
            city: true
        }
    })
}