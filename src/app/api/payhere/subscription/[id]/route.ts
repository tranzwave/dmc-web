// pages/api/subscription

import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest,{ params }: { params: { id: string } }, res: NextApiResponse) {
    const payhereSubscriptionEndpoint = 'https://sandbox.payhere.lk/merchant/v1/subscription';

    const id = params.id;
    const token = process.env.PAYHERE_AUTHORIZATION

    console.log('Request received:', id);
    console.log('Token:', token);

    try {
        // Make the request to PayHere API from your server
        const accessTokenResponse = await fetch('https://sandbox.payhere.lk/merchant/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if necessary (e.g., API keys, authentication)
                'Authorization': `Basic ${token}`
            },
            body: JSON.stringify({
                'grant_type': 'client_credentials'
            })
        });

        if (!accessTokenResponse.ok) {
            console.error("Error in fetching token:", await accessTokenResponse.json());
            return NextResponse.json({ error: 'Failed payment', originalResponse: accessTokenResponse }, { status: 500 });
        }

        const accessToken = await accessTokenResponse.json();

        console.log('Access token:', accessToken);

        const response = await fetch(`${payhereSubscriptionEndpoint}/${id}/payments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if necessary (e.g., API keys, authentication)
                'Authorization': `Bearer ${accessToken.access_token}`
            },
        });

        if (!response.ok) {
            console.error("Error in fetching payment:", response);
            return NextResponse.json({ error: 'Failed payment', originalResponse: response }, { status: 500 });
        }

        const subscriptionpayments = await response.json();

        // Forward the iframe response from PayHere to the client
        if (subscriptionpayments) {
            return NextResponse.json({ payments: subscriptionpayments.data, status: subscriptionpayments.status }, { status: 200 });
        } else {
            console.error("Error from payhere:");
            return NextResponse.json({ error: 'Failed payment', originalResponse: subscriptionpayments }, { status: 500 });
        }
    } catch (error) {
        // Handle any errors that occur when contacting PayHere
        console.error("Error in payment:", error);
        return NextResponse.json({ error: 'Failed payment', originalResponse: error }, { status: 500 });
    }
}
