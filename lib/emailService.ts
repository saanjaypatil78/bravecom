import nodemailer from 'nodemailer';

// --- Automated DropShipping Email Service ---
// Handles Order Verification and Tracking Details dispatch.

// Singleton for our ethereal test account (since real SMTP requires paid credentials)
let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
    if (transporter) return transporter;

    // Use environment variables if provided, otherwise simulate a free ethereal mailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback: Generate a testing account on the fly
        console.log("No SMTP credentials found. Generating Ethereal Test Account...");
        testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }
    return transporter;
}

export async function sendOrderConfirmationEmail(toEmail: string, orderDetails: any) {
    const mailer = await getTransporter();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #FACC15;">Sovereign Mall - Order Confirmed!</h2>
        <p>Hi there,</p>
        <p>Thank you for shopping with Sovereign Mall. Your automated dropshipping order has been successfully placed and is now processing.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order ID: ${orderDetails.orderId}</h3>
            <p><strong>Total:</strong> ₹${orderDetails.total}</p>
            <p><strong>Shipping to:</strong> ${orderDetails.address.city}, ${orderDetails.address.state}</p>
        </div>
        <p>You will receive another automated email once your tracking details are generated.</p>
        <br/>
        <p>Best regards,<br/>The Sovereign Auto-Fulfillment Team</p>
    </div>
    `;

    const info = await mailer.sendMail({
        from: '"Sovereign Mall Auto-Sync" <orders@sovereignmall.com>',
        to: toEmail,
        subject: `Order Confirmation: ${orderDetails.orderId}`,
        html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
    }
    return previewUrl;
}

export async function sendTrackingEmail(toEmail: string, trackingInfo: any) {
    const mailer = await getTransporter();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
           <h2 style="color: #22C55E;">Your Order is on the way! 🚚</h2>
        </div>
        <p>Great news! Your recent order has been shipped from our supplier and is on its way to you.</p>
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
            <h3>Tracking Details</h3>
            <p><strong>Order ID:</strong> ${trackingInfo.orderId}</p>
            <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-size: 1.1em;">${trackingInfo.trackingNumber}</span></p>
            <p><strong>Courier:</strong> ${trackingInfo.courier}</p>
            <p><strong>Estimated Delivery:</strong> ${trackingInfo.estimatedDelivery}</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://example.com/track/${trackingInfo.trackingNumber}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Package</a>
        </div>
    </div>
    `;

    const info = await mailer.sendMail({
        from: '"Sovereign Mall Auto-Sync" <shipping@sovereignmall.com>',
        to: toEmail,
        subject: `Shipping Update: Tracking info for order ${trackingInfo.orderId}`,
        html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
    }
    return previewUrl;
}

export async function sendMonthlyRoyaltyProofEmail(toEmail: string, proofData: any) {
    const mailer = await getTransporter();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
           <h2 style="color: #FACC15;">Your Monthly Returns & Royalty Processed! 💰</h2>
        </div>
        <p>Hello,</p>
        <p>Great news! Your monthly returns and franchise royalty/referral commissions have been successfully processed for the period <strong>${proofData.periodMonth}</strong>.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <h3 style="color: #1e40af; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Proof of Calculation</h3>
            <p><strong>Base Mode:</strong> ${proofData.calculationBase} (Calculated entirely on net yields, prioritizing system sustainability)</p>
            <p><strong>Total Corpus / Principle:</strong> ₹${proofData.totalPrincipal?.toLocaleString() || '0'}</p>
            <p><strong>Total Payout Processed:</strong> ₹${proofData.totalEarning?.toLocaleString() || '0'}</p>
            <br/>
            <h4>Breakdown:</h4>
            <ul style="list-style-type: none; padding-left: 0;">
                <li><strong>Royalty Amount:</strong> ₹${proofData.royaltyAmount?.toLocaleString() || '0'}</li>
                <li><strong>Referral/Level Bonus Amount:</strong> ₹${proofData.referralBonusAmount?.toLocaleString() || '0'}</li>
            </ul>
        </div>
        <p>Thank you for your continued trust in Sovereign Mall capabilities.</p>
        <br/>
        <p>Best regards,<br/>The Sovereign System</p>
    </div>
    `;

    const info = await mailer.sendMail({
        from: '"Sovereign Financials" <finance@sovereignmall.com>',
        to: toEmail,
        subject: `Monthly Returns Processed: ${proofData.periodMonth}`,
        html: htmlContent,
    });

    console.log("Payout proof message sent: %s", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
    }
    return previewUrl;
}
