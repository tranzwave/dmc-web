"use server"
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

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

export async function getBillingHistory() {
    // Placeholder: Fetch billing history from your API
    return [
      { date: "2023-05-01", amount: "$19.99", status: "Paid" },
      { date: "2023-04-01", amount: "$19.99", status: "Paid" },
      { date: "2023-03-01", amount: "$19.99", status: "Paid" },
    ]
  }
  
  export async function updateCard(formData: FormData) {
    // Placeholder: Update card info in your payment processor
    console.log("Updating card:", Object.fromEntries(formData))
  
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // In a real application, you would update the card info here
    // If successful, revalidate the page to show updated info
    revalidatePath("/subscription")
  }
  
  export async function cancelSubscription() {
    // Placeholder: Cancel subscription in your payment processor
    console.log("Cancelling subscription")
  
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // In a real application, you would cancel the subscription here
    // If successful, revalidate the page to show updated info
    revalidatePath("/subscription")
  }
  
  export async function upgradePlan(plan: string) {
    // Placeholder: Upgrade subscription plan in your payment processor
    console.log("Upgrading plan to:", plan)
  
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // In a real application, you would upgrade the subscription plan here
    // If successful, revalidate the page to show updated info
    revalidatePath("/subscription")
  }
