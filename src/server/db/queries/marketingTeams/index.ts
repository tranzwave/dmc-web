"use server"

import { and, eq } from "drizzle-orm";
import { db } from "../..";
import { marketingTeam, tenant } from "../../schema";
import { InsertMarketingTeam } from "../../schemaTypes";
import { deleteTeamFromAllUsers } from "~/server/auth";

export const getAllMarketingTeams = (tenantId:string) => {
    return db.query.marketingTeam.findMany({
        where: eq(marketingTeam.tenantId, tenantId)
    })
}

export const getMarketingTeamById = (id: string) => {
    return db.query.marketingTeam.findFirst({
        where: eq(marketingTeam.id, id),
    })
}

export const addMarketingTeam = async (marketingTeamData: InsertMarketingTeam) => {

    try {

        const foundTenant = await db.query.tenant.findFirst({
            where: eq(tenant.id, marketingTeamData.tenantId)
        });

        if (!foundTenant) {
            throw new Error("Tenant not found");
        }

        const existingTeam = await db.query.marketingTeam.findFirst({
            where: and(
                eq(marketingTeam.name, marketingTeamData.name),
                eq(marketingTeam.tenantId, marketingTeamData.tenantId)
            )
        });
    
        if (existingTeam) {
            throw new Error("Marketing team with the name already exists");
        }
    
        const insertedMarketingTeams = await db.insert(marketingTeam).values({
            name: marketingTeamData.name,
            tenantId: marketingTeamData.tenantId,
            // country: marketingTeamData.country
        }).returning();
    
        const newMarketingTeam = insertedMarketingTeams[0];
    
        if (!newMarketingTeam) {
            throw new Error("Failed to insert marketing team data");
        }
    
        // Return the inserted marketing team or some result object
        return newMarketingTeam;
    } catch (error) {
        console.log('Error saving marketing team:', error);
        return error;
    }
};

export const updateMarketingTeam = async (marketingTeamData: {
    id: string,
    name: string,
    // country: string
}) => {
    try {
        const updatedMarketingTeams = await db.update(marketingTeam).set({
            name: marketingTeamData.name,
            // country: marketingTeamData.country
        }).where(
            eq(marketingTeam.id, marketingTeamData.id)
        ).returning();

        const updatedMarketingTeam = updatedMarketingTeams[0];

        if (!updatedMarketingTeam) {
            throw new Error("Failed to update marketing team data");
        }

        // Return the updated marketing team or some result object
        return updatedMarketingTeam;
    } catch (error) {
        console.log('Error updating marketing team:', error);
        return error;
    }
};

export const deleteMarketingTeam = async (id: string) => {
    try {
        const deletedMarketingTeams = await db.delete(marketingTeam).where(
            eq(marketingTeam.id, id)
        ).returning();

        

        const deletedMarketingTeam = deletedMarketingTeams[0];

        if (!deletedMarketingTeam) {
            throw new Error("Failed to delete marketing team data");
        }

        const clerkUsersUpdated = await deleteTeamFromAllUsers(deletedMarketingTeam.id, deletedMarketingTeam.tenantId);

        if (!clerkUsersUpdated) {
            throw new Error("Failed to update clerk users");
        }

        // Return the deleted marketing team or some result object
        return deletedMarketingTeam;
    } catch (error) {
        console.log('Error deleting marketing team:', error);
        return error;
    }
};

