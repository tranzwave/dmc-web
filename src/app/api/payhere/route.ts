// pages/api/payhere.js

import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: NextApiResponse) {
    const payhere = process.env.PAYHERE_ENDPOINT ?? "";
    const payhereEndpoint = `${payhere}/pay/checkoutJ`;

    const requestBody = await req.json();

    console.log('Request received:', requestBody);

    try {
        // Make the request to PayHere API from your server
        const response = await fetch(payhereEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if necessary (e.g., API keys, authentication)
            },
            body: JSON.stringify(req.body),  // Forward the data received from the client
        });

        const iframeHtml = await response.text();

        // Forward the iframe response from PayHere to the client
        if (iframeHtml) {
            return NextResponse.json({ iframe: iframeHtml, originalResponse: iframeHtml }, { status: 200 });
        } else {
            console.error("Error from payhere:");
            return NextResponse.json({ error: 'Failed payment', originalResponse: iframeHtml }, { status: 500 });
        }
    } catch (error) {
        // Handle any errors that occur when contacting PayHere
        console.error("Error in payment:", error);
        return NextResponse.json({ error: 'Failed payment', originalResponse: error }, { status: 500 });
    }
}
