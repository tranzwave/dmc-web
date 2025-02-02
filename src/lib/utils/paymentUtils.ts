"use server"
import { eq } from 'drizzle-orm';
// import { db } from "~/server/db";
import crypto from 'crypto';
import { tenant } from '~/server/db/schema';

// export const updateDatabaseForPayment = async (clerkId: string) => {
//     try {
//         // Fetch the tenant using clerkId
//         const existingTenant = await db
//             .select()
//             .from(tenant)
//             .where(eq(tenant.clerkId, clerkId))
//             .execute();

//         if (!existingTenant || existingTenant.length === 0) {
//             throw new Error(`Tenant not found for Clerk ID: ${clerkId}`);
//         }

//         const tenantData = existingTenant[0] ?? null;

//         if (!tenantData) {
//             throw new Error(`Tenant not found for Clerk ID: ${clerkId}`);
//         }

//         // Update tenant subscription and activation status
//         await db
//             .update(tenant)
//             .set({
//                 isActive: true,
//                 updatedAt: new Date(),
//             })
//             .where(eq(tenant.id, tenantData.id))
//             .execute();

//         console.log(`Tenant ${tenantData.id} subscription updated successfully.`);
//     } catch (error) {
//         console.error('Error updating tenant for payment:', error);
//         throw error;
//     }
// };


// export const deleteClerkUserAndOrganization = async (clerkId: string) => {
//     try {
//         const clerkServerClient = clerkClient;
//         // Fetch the tenant using clerkId
//         const existingTenant = await db
//             .select()
//             .from(tenant)
//             .where(eq(tenant.clerkId, clerkId))
//             .execute();

//         if (!existingTenant || existingTenant.length === 0) {
//             throw new Error(`Tenant not found for Clerk ID: ${clerkId}`);
//         }

//         const tenantData = existingTenant[0] ?? null;

//         if (!tenantData) {
//             throw new Error(`Tenant not found for Clerk ID: ${clerkId}`);
//         }
//         // Delete the Clerk organization
//         await clerkServerClient.organizations.deleteOrganization(tenantData.clerkId);
//         console.log(`Clerk organization ${tenantData.clerkId} deleted successfully.`);

//         // Delete the tenant from the database
//         await db.delete(tenant).where(eq(tenant.id, tenantData.id)).execute();

//         console.log(`Tenant ${tenantData.id} deleted successfully.`);
//     } catch (error) {
//         console.error('Error deleting Clerk organization and tenant:', error);
//         throw error;
//     }
// };

export type PaymentHashRequest = {
    merchantId: string;
    orderId: string;
    amount: string;
    currency: string;
};

export async function generateHash(data:PaymentHashRequest): Promise<string> {
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET ?? '';
    try {
        const hash = crypto
            .createHash('md5')
            .update(
                `${data.merchantId}${data.orderId}${data.amount}${data.currency}${crypto
                    .createHash('md5')
                    .update(merchantSecret)
                    .digest('hex')
                    .toUpperCase()}`
            )
            .digest('hex')
            .toUpperCase();
        return hash;
    } catch (error) {
        console.error('Error generating hash:', error);
        throw error;
    }
}

export const startPayment = async (paymentDetails:any, window:any) => {
    try {
        (window as any).payhere.startPayment(paymentDetails);
    } catch (error) {
        console.error('Error starting payment:', error);
        throw error;
    }
}

export const getMerchantId = async () => {
    const merchantId = process.env.PAYHERE_MERCHANT_ID ?? '';
    console.log('Merchant ID:', merchantId);
    return merchantId;
}
