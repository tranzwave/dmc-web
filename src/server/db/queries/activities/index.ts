"use server"

import { eq } from 'drizzle-orm';
import { db } from "../..";
import { activity, activityVendor, activityVoucher, city } from './../../schema';

export const getAllCities = (countryCode: string) => {
    return db.query.city.findMany({
        where: eq(city.country, countryCode)
    })
}

export const getAllActivityVendors = () => {
    return db.query.activityVendor.findMany({
        with: {
            city: true
        }
    })
}

export const getActivityVendorById = (id: string) => {
    return db.query.activityVendor.findFirst({
        where: eq(activityVendor.id, id),
        with: {
            city: true
        }
    })
}

export const getActivityVouchersForVendor = (id: string) => {
    return db.query.activityVoucher.findMany({
        where: eq(activityVoucher.activityVendorId, id)
    })
}

export const getActivitiesByTypeAndCity = async (typeId: number, cityId: number) => {
    // return db.query.activity.findMany({
    //     where: eq(activity.activityType,typeId),
    //     with:{
    //         activityVendor: {
    //             where: eq(activityVendor.cityId, cityId)
    //         }
    //     }
    // })
    console.log(`Type id - ${typeId}`)
    const activitiesData = await db.query.activity.findMany({
        where: eq(activity.activityType, typeId),
        with: {
            activityVendor: {
                with: {
                    city: true
                }
            }
        }
    }).then((payload) => payload.filter((act) => act.activityVendor.cityId === cityId))

    if (activitiesData) {
        return activitiesData
    }
    // return db.query.activity.findMany()
}

export const getAllActivityTypes = () => {
    return db.query.activityType.findMany()
}