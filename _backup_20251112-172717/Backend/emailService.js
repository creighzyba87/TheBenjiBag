const nodemailer = require('nodemailer');

// Create a transporter object using the Brevo SMTP details from .env
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: process.env.BREVO_SMTP_PORT,
    secure: process.env.BREVO_SMTP_SECURE === 'true', // false for 587, true for 465
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
    const mailOptions = {
        from: process.env.BREVO_SMTP_FROM,
        to: toEmail,
        subject: `The Benji Bag - Order #${orderDetails.orderId} Confirmed!`,
        html: `
            <h1>Order Confirmation</h1>
            <p>Thank you for your order, ${orderDetails.customerName}!</p>
            <p>Your order number is <strong>${orderDetails.orderId}</strong>.</p>
            <p>Your estimated delivery window is: <strong>${orderDetails.windowStart} - ${orderDetails.windowEnd}</strong></p>
            <h2>Order Details:</h2>
            <ul>
                ${orderDetails.items.map(item => `<li>${item.quantity}x ${item.name} - $${(item.price / 100).toFixed(2)}</li>`).join('')}
            </ul>
            <p>Total: <strong>$${(orderDetails.totalAmount / 100).toFixed(2)}</strong></p>
            <p>You can track your order here: <a href="${orderDetails.trackingLink}">Track My Order</a></p>
            <p>If you have any questions, please reply to this email.</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Order Confirmation Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return false;
    }
};

const sendDeliveryNotificationEmail = async (toEmail, orderDetails) => {
    const mailOptions = {
        from: process.env.BREVO_SMTP_FROM,
        to: toEmail,
        subject: `The Benji Bag - Your Driver is En Route!`,
        html: `
            <h1>Driver En Route</h1>
            <p>Great news, ${orderDetails.customerName}!</p>
            <p>Your driver is now en route with your order #${orderDetails.orderId}.</p>
            <p>Your estimated time of arrival (ETA) is: <strong>${orderDetails.eta}</strong></p>
            <p>You can track your order here: <a href="${orderDetails.trackingLink}">Track My Order</a></p>
            <p>Please have your ID and payment ready.</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Delivery Notification Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending delivery notification email:', error);
        return false;
    }
};

module.exports = {
    sendOrderConfirmationEmail,
    sendDeliveryNotificationEmail,
};
