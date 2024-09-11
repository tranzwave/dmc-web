"use server"
import { clerkClient } from "@clerk/nextjs/server"


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