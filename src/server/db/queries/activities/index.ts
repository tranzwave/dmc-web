"use server"

import { activityVendor, city, activity } from './../../schema';
import { db } from "../.."
import { and, eq } from 'drizzle-orm';

export const getAllCities = (countryCode:string)=>{
    return db.query.city.findMany({
        where: eq(city.country,countryCode )
    })
}

export const getAllActivityVendors = ()=>{
    return db.query.activityVendor.findMany()
}

export const getActivitiesByTypeAndCity = async(typeId:number, cityId:number)=>{
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
                    city:true
                }
            }
        }
    }).then((payload)=> payload.filter((act)=>act.activityVendor.cityId === cityId))

    if(activitiesData){
        return activitiesData
    }
    // return db.query.activity.findMany()
}

export const getAllActivityTypes = ()=>{
    return db.query.activityType.findMany()
}