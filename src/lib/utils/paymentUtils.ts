"use server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { getOrganizationSubscriptionData, removeSubscriptionMetadata } from "~/server/auth";

export type PaymentHashRequest = {
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
};

export async function generateHash(data: PaymentHashRequest): Promise<string> {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET ?? "";
  console.log("Generating hash with secret:", merchantSecret);
  try {
    if (!merchantSecret) {
      throw new Error("Merchant secret not found");
    }
    const hash = crypto
      .createHash("md5")
      .update(
        `${data.merchantId}${data.orderId}${data.amount}${data.currency}${crypto
          .createHash("md5")
          .update(merchantSecret)
          .digest("hex")
          .toUpperCase()}`,
      )
      .digest("hex")
      .toUpperCase();
    return hash;
  } catch (error) {
    console.error("Error generating hash:", error);
    throw error;
  }
}

export const startPayment = async (paymentDetails: any, window: any) => {
  try {
    (window as any).payhere.startPayment(paymentDetails);
  } catch (error) {
    console.error("Error starting payment:", error);
    throw error;
  }
};

export const getMerchantId = async () => {
  const merchantId = process.env.PAYHERE_MERCHANT_ID ?? "";
  console.log("Merchant ID:", merchantId);
  return merchantId;
};

export const getAccessToken = async () => {
  const payhere = process.env.NEXT_PUBLIC_PAYHERE_ENDPOINT ?? "";
    const payhereTokenEndpoint = `${payhere}/merchant/v1/oauth/token`;
    const token = process.env.PAYHERE_AUTHORIZATION;

    if (!token) {
      console.error("Missing PAYHERE_AUTHORIZATION token.");
      return null;
    }

    try {
      const accessTokenResponse = await fetch(payhereTokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${token}`,
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      });

      if (!accessTokenResponse.ok) {
        const errorData = await accessTokenResponse.json();
        console.error("Error fetching token:", errorData);
        return null;
      }

      const { access_token } = await accessTokenResponse.json();
      if (!access_token) {
        console.error("Missing access token in response.");
        return null;
      }

      console.log("Access token received:", access_token);
      return access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null;
    }
    }

export async function getBillingHistory(organizationId: string) {
    const payhere = process.env.PAYHERE_ENDPOINT ?? '';
    const payhereSubscriptionEndpoint = `${payhere}/merchant/v1/subscription`;
  
    try {
      const subscriptionData = await getOrganizationSubscriptionData(organizationId);
      if (!subscriptionData?.subscription_id) {
        console.error("Invalid subscription data for organization:", organizationId);
        return [];
      }
  
      const access_token = await getAccessToken();
  
      const paymentResponse = await fetch(
        `${payhereSubscriptionEndpoint}/${subscriptionData.subscription_id}/payments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
  
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error("Error fetching payment history:", errorData);
        return [];
      }
  
      const paymentData = await paymentResponse.json();
      if (!paymentData?.data) {
        console.error("Invalid payment data structure:", paymentData);
        return [];
      }

        console.log("Payment data received:", paymentData);
  
      return paymentData.data.map((payment: any) => ({
        amount: `${payment.currency} ${payment.amount.toFixed(2)}`,
        date: payment.date, // Ensure the date format is correct
        description: `Subscription for ${payment.description} plan` || "No description available",
      }));
    } catch (error) {
      console.error("Error fetching billing history:", error);
      return [];
    }
  }
  
  

export async function updateCard(formData: FormData) {
  // Placeholder: Update card info in your payment processor
  console.log("Updating card:", Object.fromEntries(formData));

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real application, you would update the card info here
  // If successful, revalidate the page to show updated info
  revalidatePath("/subscription");
}

export async function cancelSubscription(organizationId: string) {
  // Placeholder: Cancel subscription in your payment processor
  
  try {
    const payhere = process.env.PAYHERE_ENDPOINT ?? '';
    const payhereSubscriptionEndpoint = `${payhere}/merchant/v1/subscription/cancel`;
    const subscriptionData = await getOrganizationSubscriptionData(organizationId);
    const access_token = await getAccessToken();

    const body = JSON.stringify({ subscription_id: subscriptionData.subscription_id });

    const response = await fetch(`${payhereSubscriptionEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error cancelling subscription:", errorData);
      return;
    }

    console.log("Subscription cancelled successfully");
    await removeSubscriptionMetadata(organizationId);

    revalidatePath("/admin/dashboard");
    }
    catch (error) {
        console.error("Error cancelling subscription:", error);
        throw error;
        }
    // Simulate API call
  
}

export async function upgradePlan(plan: string) {
  // Placeholder: Upgrade subscription plan in your payment processor
  console.log("Upgrading plan to:", plan);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real application, you would upgrade the subscription plan here
  // If successful, revalidate the page to show updated info
  revalidatePath("/subscription");
}
