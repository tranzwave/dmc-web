import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const requestBody = await req.json();
        const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = requestBody;

        const merchantSecret = 'MjIyNzA4MzE3NjY2NDkwMzYwNTM5MjE3NzIzMTgyNDUxNDc4MTg1';
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

        if (localMd5sig === md5sig && status_code === '2') {
            // Payment verified as successful
            console.log('Payment successful for Order ID:', order_id);
            return NextResponse.json({ message: 'Payment verified' }, { status: 200 });
        } else {
            console.error('Payment verification failed.');
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // Optionally, you could implement a GET endpoint if required (e.g., for status checks)
    return NextResponse.json({ message: 'Use POST to verify payment' }, { status: 200 });
}
export async function generateHash(merchant_id: string, order_id: string, amount: string, currency: string, merchantSecret: string): Promise<string> {
    const hash = crypto
        .createHash('md5')
        .update(
            `${merchant_id}${order_id}${amount}${currency}${crypto
                .createHash('md5')
                .update(merchantSecret)
                .digest('hex')
                .toUpperCase()}`
        )
        .digest('hex')
        .toUpperCase();
    return hash;
}
