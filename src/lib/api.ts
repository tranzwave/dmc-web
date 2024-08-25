// lib/api.ts
"use server"
import { Hotel } from "~/components/bookings/addBooking/forms/hotelsForm/columns";
import { Transport } from "~/components/bookings/addBooking/forms/transportForm/columns";
import { Booking } from "~/components/bookings/home/columns";
import { Driver, VehicleType } from "./types/driver/type";
import { driversMockData, hotelsMockData, shopsMockData } from "./mockData";
import { Activity } from "./types/activity/type";
import { Shop } from "~/components/bookings/addBooking/forms/shopsForm/columns";
import { BookingDetails } from "~/app/dashboard/bookings/add/context";
import { getAllHotels } from "~/server/db/queries/hotel";
import { SelectHotel } from "~/server/db/schemaTypes";
import { HotelDTO } from "./types/hotel";


export async function getHotelData(): Promise<HotelDTO[]> {
  // Mock data
  // const mockData: Hotel[] = hotelsMockData;

  try {
    const hotels = await getAllHotels();
    return hotels;
  } catch (error) {
    console.error("Failed to fetch hotel data:", error);
    throw new Error("Failed to load hotel data.");
  }
}
