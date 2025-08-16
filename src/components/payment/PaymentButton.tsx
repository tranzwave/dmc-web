/*global payhere*/
"use client"
import React, { useEffect, useState } from "react";
import { generateHash, getMerchantId } from "~/lib/utils/paymentUtils";
import { getLKRAmount } from "~/lib/utils/currencyConverter";
import { Button } from "../ui/button";
import { ClerkOrganizationPublicMetadata, ClerkUserPublicMetadata, Package } from "~/lib/types/payment";
import { useOrganization, useUser } from "@clerk/nextjs";
import { toast } from "~/hooks/use-toast";

declare global {
    interface Window {
        payhere: any;
    }
}

interface PaymentButtonProps {
    selectedPackage: Package;
    closeDialog?: () => void;
}

type PayherePaymentDetails = {
    sandbox: boolean;
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    order_id: string;
    amount: string;
    currency: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    items: string;
    custom_1: string;
    custom_2: string;
    recurrence: string;
    duration: string;
    hash:string;
}

const PaymentButton = ({ selectedPackage, closeDialog }: PaymentButtonProps) => {

    const { organization, isLoaded } = useOrganization()
    const { user, user: IsuserLoaded } = useUser()
    const [hash, setHash] = useState<string | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<PayherePaymentDetails | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [convertedAmount, setConvertedAmount] = useState<string | null>(null);

    useEffect(() => {
        const getHash = async() =>{
            if(!organization || !isLoaded || !IsuserLoaded || !user){
                console.error("Organization not found.");
                return;
            }
            try {
                setIsConverting(true);
                const date = Date.now()
                const address = organization.publicMetadata as ClerkOrganizationPublicMetadata ? (organization.publicMetadata as ClerkOrganizationPublicMetadata).address : (() => { throw new Error("Address not found") })()
                const city = organization.publicMetadata as ClerkOrganizationPublicMetadata ? (organization.publicMetadata as ClerkOrganizationPublicMetadata).country : (() => { throw new Error("City not found") })()
                const country = organization.publicMetadata as ClerkOrganizationPublicMetadata ? (organization.publicMetadata as ClerkOrganizationPublicMetadata).country : (() => { throw new Error("Country not found") })()
                const order_id = `${organization.name.replaceAll(
                    " ",
                    ""
                )}${user.username}${date}`
                const phoneNumber = user.publicMetadata as ClerkUserPublicMetadata ? (user.publicMetadata as ClerkUserPublicMetadata).info.contact.replaceAll("+", "0") : (() => { throw new Error("Contact number not found") })()
                const merchant_id = await getMerchantId();
                
                // Convert USD to LKR if the package currency is USD
                let paymentAmount: string;
                if (selectedPackage.currency === "USD" && selectedPackage.price > 0) {
                    const lkrAmount = await getLKRAmount(selectedPackage.price);
                    paymentAmount = lkrAmount.toFixed(2);
                    setConvertedAmount(paymentAmount);
                } else {
                    paymentAmount = selectedPackage.price.toFixed(2);
                    setConvertedAmount(null);
                }
                
                const hash = await generateHash({
                    merchantId: merchant_id,
                    orderId: order_id,
                    amount: paymentAmount,
                    currency: "LKR",
                })
                setHash(hash)
                const notify_url = process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL ? process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL : (() => { throw new Error("Notify URL not found") })();
                const return_url = process.env.NEXT_PUBLIC_PAYHERE_RETURN_URL ? process.env.NEXT_PUBLIC_PAYHERE_RETURN_URL : (() => { throw new Error("Return URL not found") })();
                const cancel_url = process.env.NEXT_PUBLIC_PAYHERE_CANCEL_URL ? process.env.NEXT_PUBLIC_PAYHERE_CANCEL_URL : (() => { throw new Error("Cancel URL not found") })();

                setPaymentDetails({
                    sandbox: true,
                    merchant_id: merchant_id,
                    return_url: return_url,
                    cancel_url: cancel_url,
                    notify_url: notify_url,
                    order_id: order_id,
                    amount: paymentAmount,
                    currency: "LKR",
                    first_name: user.firstName ? user.firstName : (() => { throw new Error("First name not found") })(),
                    last_name: user.lastName ? user.lastName : (() => { throw new Error("Last name not found") })(),
                    email: user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : (() => { throw new Error("Email not found") })(),
                    phone: phoneNumber,
                    address: address,
                    city: country,
                    country: country,
                    items: selectedPackage.name,
                    custom_1: organization.id,
                    custom_2: selectedPackage.name,
                    recurrence: "1 Month",
                    duration: "Forever",
                    hash: hash
                })
            } catch (error) {
                console.error("Error generating hash:", error);
                toast({
                    title: "Uh Oh",
                    description: "Something went wrong. Please refresh and try again.",
                })
                throw error;
            } finally {
                setIsConverting(false);
            }
        }

        getHash()

    }, []);

    return (
        <div className="w-full h-full">
            {hash && organization && paymentDetails && !isConverting ? (
            <div>
                {/* Show converted amount for USD packages */}
                {convertedAmount && selectedPackage.currency === "USD" && (
                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-slate-700 mb-1">Payment Summary</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-semibold text-slate-900">
                                        {selectedPackage.price} USD
                                    </span>
                                    <span className="text-slate-400">→</span>
                                    <span className="text-lg font-semibold text-[#287f71]">
                                        {convertedAmount} LKR
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Amount converted using current exchange rate
                                </p>
                            </div>
                            <div className="ml-4 p-2 bg-white rounded-md border border-slate-200">
                                <div className="text-center">
                                    <div className="text-xs font-medium text-slate-600">Rate</div>
                                    <div className="text-sm font-semibold text-slate-800">
                                        {(parseFloat(convertedAmount) / selectedPackage.price).toFixed(2)} LKR/USD
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form method="post" action={`${process.env.NEXT_PUBLIC_PAYHERE_ENDPOINT ?? ""}/pay/checkout`}>
                    <input type="hidden" name="merchant_id" value= {paymentDetails.merchant_id} />
                    <input type="hidden" name="return_url" value={paymentDetails.return_url} />
                    <input type="hidden" name="cancel_url" value={paymentDetails.cancel_url} />
                    <input type="hidden" name="notify_url" value= {paymentDetails.notify_url} />
                    <input type="hidden" name="order_id" value={paymentDetails.order_id} />
                    <input type="hidden" name="items" value={paymentDetails.items} />
                    <input type="hidden" name="currency" value={paymentDetails.currency} />
                    <input type="hidden" name="recurrence" value={paymentDetails.recurrence} />
                    <input type="hidden" name="duration" value={paymentDetails.duration} />
                    <input type="hidden" name="amount" value={paymentDetails.amount} />
                    <input type="hidden" name="first_name" value={paymentDetails.first_name} />
                    <input type="hidden" name="last_name" value={paymentDetails.last_name} />
                    <input type="hidden" name="email" value={paymentDetails.email} />
                    <input type="hidden" name="phone" value={paymentDetails.phone} />
                    <input type="hidden" name="address" value={paymentDetails.address} />
                    <input type="hidden" name="city" value={paymentDetails.city} />
                    <input type="hidden" name="country" value={paymentDetails.country} />
                    <input type="hidden" name="custom_1" value={paymentDetails.custom_1} />
                    <input type="hidden" name="custom_2" value={paymentDetails.custom_2} />
                    <input type="hidden" name="hash" value={paymentDetails.hash} />
                    {/* <input type="submit" value="Buy Now" /> */}
                    <Button type="submit" id="payhere-payment" className="w-full py-4 bg-[#287f71] hover:bg-[#287f71]/90 transition-colors duration-200" disabled={!isLoaded || !organization || !IsuserLoaded}>
                        Continue with {selectedPackage.name} Plan
                    </Button>
                </form>


            </div>
            ) : (
                <Button variant="primaryGreen" className="w-full" disabled>
                    {isConverting ? "Converting Currency..." : "Please Wait"}
                </Button>
            )}
        </div>
    );
};

export default PaymentButton;