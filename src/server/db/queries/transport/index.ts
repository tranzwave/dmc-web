"use server"

import { eq } from 'drizzle-orm';
import { db } from '../..';
import { driver, transportVoucher, vehicle, language } from './../../schema';

export const getAllVehicleTypes = async ()=>{
    return await db.query.vehicle.findMany({
        columns:{
            vehicleType:true
        }
    }).then((vehicles)=> {
        const types = vehicles.map((vehicle)=> vehicle.vehicleType);

        const uniqueTypes = new Set(types)

        return Array.from(uniqueTypes)
    })
}

export const getAllLanguages = ()=>{
    return db.query.language.findMany();
}


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

export const getAllDriversByVehicleTypeAndLanguage = async (
    vehicleType: string,
    languageCode: string
  ) => {
    const drivers = await db.query.driver.findMany({
      with: {
        vehicles: {
          with: {
            vehicle: true,
          },
        },
        languages: {
          with: {
            language: true,
          },
        },
      },
    });

    console.log(drivers)
  
    // Filter drivers based on vehicle type and language code
    const filteredDrivers = drivers.filter((driver) => {
      const hasMatchingVehicle = driver.vehicles.some(
        (vehicle) => vehicle.vehicle.vehicleType === vehicleType
      );
  
      const speaksLanguage = driver.languages.some(
        (language) => language.language.code === languageCode
      );
  
      return hasMatchingVehicle && speaksLanguage;
    });
  
    return filteredDrivers;
  };
  


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
    return db.query.transportVoucher.findMany({
        where: eq(transportVoucher.driverId, id)
    })
}