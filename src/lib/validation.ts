// lib/validation.ts
import { z } from 'zod';

export const generalSchema = z.object({
  bookingName: z.string().min(1, "Booking name is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
});

export const hotelsSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  hotelBookingDate: z.string().min(1, "Hotel booking date is required"),
});

export const restaurantsSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  restaurantBookingDate: z.string().min(1, "Restaurant booking date is required"),
});

export const activitiesSchema = z.object({
  activityName: z.string().min(1, "Activity name is required"),
  activityDate: z.string().min(1, "Activity date is required"),
});

export const transportSchema = z.object({
  transportType: z.string().min(1, "Transport type is required"),
  transportDate: z.string().min(1, "Transport date is required"),
});

export const shopsSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  shopDate: z.string().min(1, "Shop date is required"),
});
