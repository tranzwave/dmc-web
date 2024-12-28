"use server"
import { clerkClient } from "@clerk/nextjs/server"
import { db } from "../..";
import { eq } from "drizzle-orm";
import { tenant } from "../../schema";
import { VoucherSettings } from "~/lib/types/booking";
import { SelectTenant } from "../../schemaTypes";


type CreateParams = {
    name: string,
    createdBy: string,
    publicMetadata: {
        country: string,
        domainName: string
    }
}

export const createTenant = async(data:CreateParams)=>{
    try {
        const res = await clerkClient().organizations.createOrganization({
            name: data.name,
            createdBy: data.createdBy,
            publicMetadata: {
                country: data.publicMetadata.country,
                domainName: data.publicMetadata.domainName
            }
        })

        if(!res){
            throw Error("Error creating organization")
        }

        return res;
      } catch (error) {
        console.log(error)
        throw error
      }
} 

//Get tenant by id fro db
export const getTenantById = (tenantId:string) => {
    return db.query.tenant.findFirst({
        where: eq(tenant.id, tenantId)
    })
  };

//Update tenants voucher settings drizzle
export const updateTenantVoucherSettings = async (tenantId: string, tenantData: Partial<SelectTenant>) => {
    const res = await db.update(tenant)
        .set({
            voucherSettings: tenantData.voucherSettings,
        })
        .where(eq(tenant.id, tenantId))
        .returning();
    if (!res) {
        throw Error("Error updating tenant voucher settings");
    }
    return res;
}
