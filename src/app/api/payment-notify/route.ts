import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// POST method to verify payment notification
export const POST = (req: NextApiRequest, res: NextApiResponse) => {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

    const merchantSecret = '';
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

    console.log({
        merchant_id,
        order_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
        localMd5sig,
    });

    if (localMd5sig === md5sig && status_code === '2') {
        // Payment verified as successful
        console.log('Payment successful for Order ID:', order_id);
        res.status(200).send('Payment verified');
    } else {
        console.error('Payment verification failed.');
        res.status(400).send('Payment verification failed');
    }
};
