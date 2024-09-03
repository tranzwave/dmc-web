import { InsertCity } from "~/server/db/schemaTypes";

export type HotelDTO = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
    tenantId: string;
    primaryEmail: string;
    name: string;
    stars: number;
    primaryContactNumber: string;
    streetName: string;
    province: string;
    hasRestaurant: boolean;
    city: InsertCity
}