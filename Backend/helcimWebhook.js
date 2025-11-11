const express = require('express');
const { Order, Transaction } = require('../models/schema');
const router = express.Router();

// Helcim webhook handler
router.post('/helcim-webhook', (req, res) => {
    console.log('Received Helcim Webhook:', req.body);

    // 1. Validate the webhook signature (if provided by Helcim)
    // 2. Extract transaction details (orderId, status, amount, transactionId)
    const { orderId, transactionStatus, transactionId, amount } = req.body;

    // 3. Find the corresponding order in the database
    // 4. Update the order status and log the transaction
    // Example:
    /*
    const Order = require('../models/schema').Order;
    const Transaction = require('../models/schema').Transaction;

    try {
        const order = await Order.findOne({ orderId: orderId });
        if (!order) {
            return res.status(404).send('Order not found');
        }

        const statusMap = {
            'APPROVED': 'pending', // Assuming 'pending' until assigned to driver
            'DECLINED': 'cancelled',
            // Add other Helcim statuses
        };

        order.status = statusMap[transactionStatus] || order.status;
        await order.save();

        await Transaction.create({
            orderId: order._id,
            amount: amount * 100, // Convert to cents
            status: transactionStatus === 'APPROVED' ? 'completed' : 'failed',
            paymentMethod: 'Helcim',
            transactionId: transactionId,
        });

        // 5. Notify the admin dashboard via Socket.IO
        req.io.to('admin').emit('newOrder', { orderId: order.orderId, status: order.status });

        res.status(200).send('Webhook received and processed');
    } catch (error) {
        console.error('Error processing Helcim webhook:', error);
        res.status(500).send('Internal Server Error');
    }
    */

        // 3. Find the corresponding order in the database
    // 4. Update the order status and log the transaction
    try {
        const order = await Order.findOne({ orderId: orderId });
        if (!order) {
            return res.status(404).send('Order not found');
        }

        const statusMap = {
            'APPROVED': 'assigned', // Assuming 'assigned' is the next step after payment
            'DECLINED': 'cancelled',
            // Add other Helcim statuses
        };

        order.status = statusMap[transactionStatus] || order.status;
        await order.save();

        await Transaction.create({
            orderId: order._id,
            amount: amount * 100, // Convert to cents
            status: transactionStatus === 'APPROVED' ? 'completed' : 'failed',
            paymentMethod: 'Helcim',
            transactionId: transactionId,
        });

        // 5. Notify the admin dashboard via Socket.IO
        req.io.to('admin').emit('newOrder', { orderId: order.orderId, status: order.status });

        res.status(200).send('Webhook received and processed');
    } catch (error) {
        console.error('Error processing Helcim webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
