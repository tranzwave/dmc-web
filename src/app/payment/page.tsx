'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '~/components/ui/button';
import { generateHash, startPayment } from '~/lib/utils/paymentUtils';
import { start } from 'repl';
import PaymentButton from '~/components/payment/PaymentButton';
import EnhancedPaymentPackages from '~/components/payment/PaymentForm';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
}

interface PaymentPageProps {
    searchParams: { packageId: string; organizationId: string; packageName: string };
}



const PaymentPage = ({ searchParams }: PaymentPageProps) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);


    return (
        <div>
            <h1>Payment Page</h1>
            <p>Confirm your subscription details before proceeding with the payment.</p>

            <EnhancedPaymentPackages onClose={()=>{}}/>
            
        </div>
    );
};

export default PaymentPage;
