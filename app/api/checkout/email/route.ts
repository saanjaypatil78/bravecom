import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendTrackingEmail } from '@/lib/emailService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, orderDetails } = body;

        if (!email || !orderDetails) {
            return NextResponse.json({ error: 'Missing email or order details' }, { status: 400 });
        }

        console.log(`[Webhook] Received successful order placement for: ${email}`);

        // 1. Send the instant Order Confirmation
        const confirmationUrl = await sendOrderConfirmationEmail(email, orderDetails);

        // 2. Simulate the Dropshipping Supplier Fulfillment Delay
        // In reality, this would be a separate webhook from AliExpress/Oberlo.
        // For our automated ecosystem, we'll simulate the supplier dispatching it 15 seconds later.
        const trackingInfo = {
            orderId: orderDetails.orderId,
            trackingNumber: `AWB${Math.floor(Math.random() * 1000000000)}IN`,
            courier: 'Delhivery Surface',
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
        };

        // Fire and forget the simulated tracking email
        setTimeout(async () => {
            console.log(`[Auto-Fulfillment] Supplier shipped order! Dispatching tracking email to ${email}...`);
            const trackingUrl = await sendTrackingEmail(email, trackingInfo);
            console.log(`[Auto-Fulfillment] Simulated Tracking Sent. Preview: ${trackingUrl}`);

            // Send Admin Copy
            await sendTrackingEmail("admin@uniqbe.test", trackingInfo);
            console.log(`[Auto-Fulfillment] Admin sync copy sent.`);
        }, 8000); // Wait 8 seconds to simulate processing

        return NextResponse.json({
            success: true,
            message: 'Emails dispatched to auto-fulfillment queue.',
            previewUrl: confirmationUrl // Returning this so we can log it on the client for testing!
        });

    } catch (error: any) {
        console.error('Error in email webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
