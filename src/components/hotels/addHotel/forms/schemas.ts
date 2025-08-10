import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// General
export const hotelGeneralSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  stars: z.number().min(1, "Star rating is required"),
  primaryEmail: z.string().email("Invalid email address"),
  primaryContactNumber: z
    .string()
    .refine(
      (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() ?? false;
      },
      { message: "Invalid phone number" }
    ),
  streetName: z.string().min(1, "Street name is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  hasRestaurant: z.boolean().default(true),
});

export type HotelGeneralFormData = z.infer<typeof hotelGeneralSchema>;

// Rooms
const numberFromInput = (min?: number) =>
  z.preprocess(
    (v) => {
      if (v === "" || v === undefined || v === null) return undefined;
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() !== "") return Number(v);
      return v;
    },
    z
      .number({ invalid_type_error: "Enter a number" })
      .refine(
        (n) => (min !== undefined ? n >= min : true),
        { message: min !== undefined ? `Must be ${min} or higher` : undefined }
      )
  );

export const roomsSchema = z.object({
  roomType: z.string().min(1, "Room type is required"),
  typeName: z.string().min(0, "Type name is required"),
  count: numberFromInput(1).optional(),
  amenities: z.string().optional(),
  floor: numberFromInput(0).optional(),
  bedCount: numberFromInput(1).optional(),
  additionalComments: z.string().optional(),
});

export type RoomsFormData = z.infer<typeof roomsSchema>;

// Staff
export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .refine(
      (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() ?? false;
      },
      { message: "Invalid phone number" }
    ),
  occupation: z.string().min(1, "Occupation is required"),
});

export type StaffFormData = z.infer<typeof staffSchema>;
