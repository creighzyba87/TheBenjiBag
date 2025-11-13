const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const { User, Product, Order, Driver, Referral, Address, Transaction } = require('./models/schema');
const helcimWebhookRouter = require('./helcimWebhook');

// --- Public Routes ---

// Map Key Endpoint (handled in server.js for simplicity, but can be here)
// router.get('/map-key', (req, res) => { ... });

// Product Catalog
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({ active: true });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// --- Authentication Routes (Placeholder) ---
// Login, Register, etc. will be implemented here.

// --- Helcim Webhook (Needs to be outside /api if Helcim hits the root, but we'll keep it here for now) ---
router.use(helcimWebhookRouter);

// --- Protected Routes (Require Auth) ---
router.use(requireAuth);

// --- Referral Routes ---
router.post('/referral/generate', requireRole('customer'), async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.referralCode) {
            return res.json({ code: user.referralCode });
        }

        // Generate a unique referral code
        const code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Update user with the new code
        user.referralCode = code;
        await user.save();

        // Create a new referral entry
        await Referral.create({
            code: code,
            referrerId: user._id,
            referredUserIds: [],
            creditAmount: 2000, // $20 credit in cents
        });

        res.json({ code: code });
    } catch (error) {
        console.error('Error generating referral code:', error);
        res.status(500).json({ message: 'Error generating referral code' });
    }
});

// --- Customer Routes ---
router.get('/customer/orders', requireRole('customer'), async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

router.post('/customer/order', requireRole('customer'), async (req, res) => {
    // Order creation logic, including min/max validation, will go here
    res.status(501).json({ message: 'Order creation not yet implemented' });
});

router.post('/customer/address', requireRole('customer'), async (req, res) => {
    // Address creation logic will go here
    res.status(501).json({ message: 'Address creation not yet implemented' });
});

// --- Driver Routes ---
router.get('/driver/my-orders', requireRole('driver'), async (req, res) => {
    // Fetch orders assigned to this driver
    res.status(501).json({ message: 'Driver order fetching not yet implemented' });
});

router.post('/driver/location', requireRole('driver'), async (req, res) => {
    // Update driver location and broadcast via Socket.IO
    res.status(501).json({ message: 'Driver location update not yet implemented' });
});

// --- Admin Routes ---
router.get('/admin/orders', requireRole('admin'), async (req, res) => {
    // Fetch all orders for admin dashboard
    res.status(501).json({ message: 'Admin order fetching not yet implemented' });
});

router.get('/admin/users', requireRole('admin'), async (req, res) => {
    // Fetch all users for admin dashboard
    res.status(501).json({ message: 'Admin user fetching not yet implemented' });
});

// ... other admin routes (CRUD, reporting)

module.exports = router;
