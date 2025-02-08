
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { generateHash } from '~/lib/utils/paymentUtils';

// POST method to verify payment notification
export const POST = async (req: Request) => {
    try {
        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET ?? '';
        console.log('Request received raw:', req);
        const requestBody = await req.formData();
        const params = Object.fromEntries(
            Array.from(requestBody.entries()).map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value.toString()])
        );
    
        console.log('Request received:', params);
    
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            custom_1,
            custom_2,
            method,
            status_message,
            card_holder_name,
            card_no,
            card_expiry,
            subscription_id
        } = params;
        const localMd5sig = crypto
            .createHash('md5')
            .update(
                `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${crypto
                    .createHash('md5')
                    .update(merchantSecret)
                    .digest('hex')
                    .toUpperCase()}`
            )
            .digest('hex')
            .toUpperCase();

        console.log('Received MD5 signature:', md5sig);
        console.log('Local MD5 signature:', localMd5sig);
    
        if (localMd5sig === md5sig) {
            console.log('Payment verified successfully');
            // Update your database with the payment status
            // Example: updatePaymentStatus(order_id, status_code, payment_id, method, status_message, card_holder_name, card_no, card_expiry);
    
            return NextResponse.json({ message: 'Payment verified successfully' });
        } else {
            console.error('Payment verification failed');
            return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
        }
        
    } catch (error) {
        console.error('Error in payment notification:', error);
        
    }
};
