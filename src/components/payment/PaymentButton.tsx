/*global payhere*/
import React from "react";
import { generateHash, getMerchantId } from "~/lib/utils/paymentUtils";
import { Button } from "../ui/button";
import { or } from "drizzle-orm";
import { Package } from "~/lib/types/payment";

declare global {
    interface Window {
        payhere: any;
    }
}

interface PaymentButtonProps {
    selectedPackage: Package;
}

const PaymentButton = ({ selectedPackage }: PaymentButtonProps) => {
    const handlePayment = async () => {
        const merchantId = await getMerchantId();
        console.log("Merchant ID: ", merchantId);
        const userDetails = {
            first_name: "Saman",
            last_name: "Perera",
            email: "samanp@gmail.com",
            phone: "0771234567",
            address: "No.1, Galle Road",
            city: "Colombo",
            country: "Sri Lanka",
        }

        const orderDetails = {
            order_id: "ItemNo12346",
            items: "Basic Package",
            amount: "100",
            currency: "LKR",
        }
        const paymentDetails = {
            order_id: "ItemNo12346",
            amount: "1005.00",
            currency: "LKR",
            first_name: "Saman",
            last_name: "Perera",
            email: "samanp@gmail.com",
            phone: "0771234567",
            address: "No.1, Galle Road",
            city: "Colombo",
            country: "Sri Lanka",
        };

        try {

            const hash = await generateHash({
                merchantId: merchantId,
                orderId: paymentDetails.order_id,
                amount: paymentDetails.amount,
                currency: "LKR",
            })

            if (hash) {

                // Payment configuration
                const payment = {
                    sandbox: true, // Use sandbox for testing
                    merchant_id: merchantId,
                    return_url: "http://localhost:3001/payment/success", // Replace with your return URL
                    cancel_url: "http://localhost:3001/payment/cancel", // Replace with your cancel URL
                    notify_url:
                        "https://e1e1-2402-4000-2080-875a-6feb-c94c-a877-54da.ngrok-free.app/api/webhooks/payment-notify", // Replace with your notify URL - This should be public IP (No Localhost)
                    order_id: paymentDetails.order_id,
                    items: "Item Title",
                    amount: paymentDetails.amount,
                    currency: paymentDetails.currency,
                    first_name: paymentDetails.first_name,
                    last_name: paymentDetails.last_name,
                    email: paymentDetails.email,
                    phone: paymentDetails.phone,
                    address: paymentDetails.address,
                    city: paymentDetails.city,
                    country: paymentDetails.country,
                    hash: hash,
                };

                // Initialize PayHere payment
                (window as Window & typeof globalThis).payhere.startPayment(payment);
            } else {
                console.error("Failed to generate hash for payment.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="w-full">
            <Button id="payhere-payment" onClick={handlePayment} className="w-full py-4 bg-[#287f71] hover:bg-[#287f71]/90 transition-colors duration-200">
                Purchase {selectedPackage.name} Plan
            </Button>
        </div>
    );
};

export default PaymentButton;