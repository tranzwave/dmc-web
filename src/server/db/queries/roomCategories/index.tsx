"use server"

import { eq } from "drizzle-orm";
import { db } from "../..";
import { roomCategory } from "../../schema";

export const getAllRoomCategories = (tenantId:string) => {
    return db.query.roomCategory.findMany({
      where: eq(roomCategory.tenantId, tenantId),
    });
}

export const getRoomCategoryById = (tenantId:string, id: string) => {
    return db.query.roomCategory.findFirst({
      where: eq(roomCategory.tenantId, tenantId),
      with: {
        hotel: true,
      },
    });
}

export const createRoomCategory = async (tenantId:string, name: string) => {
    const newRoomCategory = await db.insert(roomCategory).values({
        name,
        tenantId
    }).returning();
    return newRoomCategory;
}

export const updateRoomCategory = async (tenantId:string, id: string, name: string) => {
    const updatedRoomCategory = await db.update(roomCategory).set({
        name
    }).where(eq(roomCategory.id, id)).returning();
    return updatedRoomCategory;
}


