"use client";

import { InsertHotel, InsertHotelRoom, InsertHotelStaff, InsertMeal, InsertRestaurant } from "~/server/db/schemaTypes";

export type HotelGeneralType = InsertHotel
export type HotelStaffType = InsertHotelStaff
export type HotelRoomType = InsertHotelRoom
export type RestaurantType = InsertRestaurant
export type RestaurantMealType = InsertMeal

export type Restaurant = {
  restaurant: RestaurantType,
  meals: RestaurantMealType[]
}