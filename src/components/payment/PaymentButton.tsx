/*global payhere*/
"use client"
import React, { useEffect } from "react";
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

    useEffect(() => {
        if (typeof window !== "undefined" && window.payhere) {
            // Event listener for successful payments
            window.payhere.onCompleted = function (orderId: string) {
                console.log(window.payhere)
                console.log("Payment completed. OrderID:", orderId);
                window.location.href = "http://localhost:3001/payment/success"; // Redirect manually
            };

            // Event listener for payment dismissal
            window.payhere.onDismissed = function () {
                console.log("Payment window closed by user.");
            };

            // Event listener for payment errors
            window.payhere.onError = function (error: string) {
                console.error("Payment error:", error);
            };
        }
    }, []);
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
            amount: "50",
            currency: "USD",
        }
        const paymentDetails = {
            order_id: "ItemNo12346",
            amount: "50.00",
            currency: "USD",
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
                currency: "USD",
            })

            if (hash) {

                // Payment configuration
                const payment = {
                    sandbox: true, // Use sandbox for testing
                    merchant_id: merchantId,
                    return_url: "http://localhost:3001/payment/success", // Replace with your return URL
                    cancel_url: "http://localhost:3001/payment/cancel", // Replace with your cancel URL
                    notify_url:
                        "https://63dd-2402-4000-2100-480c-dac3-2d39-484a-37d5.ngrok-free.app/api/webhooks/payment-notify", // Replace with your notify URL - This should be public IP (No Localhost)
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
                    recurrence: "1 Month",
                    duration: "Forever", 
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
                Continue with {selectedPackage.name} Plan
            </Button>
        </div>
    );
};

export default PaymentButton;