"use server"

import { eq } from 'drizzle-orm';
import { db } from '../..';
import { driver, transportVoucher } from './../../schema';


export const getAllDrivers = ()=>{
    return db.query.driver.findMany({
        columns:{
            cityId: false
        },
        with: {
            city: {
                columns:{
                    id:false
                }
            }
        }
    });
}


export const getDriverByIdQuery = (id:string)=>{
    return db.query.driver.findFirst({
        where: eq(driver.id, id),
        columns:{
            cityId: false
        },
        with: {
            city: {
                columns:{
                    id:false
                }
            }
        }
    })
}


export const getTransportVouchersForDriver = (id:string)=>{
    return db.query.shopsVoucher.findMany({
        where: eq(transportVoucher.driverId, id)
    })
}