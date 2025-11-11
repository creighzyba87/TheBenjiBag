const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { recomputeAndBroadcastETA } = require('./realtime');
const { Driver } = require('./models/schema');

// Load environment variables from .env file in the backend directory
dotenv.config({ path: __dirname + '/.env' });

const { connectDB } = require('./db.js');
const { requireAuth, requireRole } = require('./routes/authMiddleware'); // Assuming this is where auth middleware is
const mainRouter = require('./routes/mainRouter');

const app = express();
const server = http.createServer(app);

// --- Socket.IO Setup ---
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN.split(','), // Use the CORS_ORIGIN from .env
        methods: ['GET', 'POST'],
    },
});

// Attach io to the request object so it can be used in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- Middleware ---
const { apiLimiter } = require('./routes/securityMiddleware');

// Apply general rate limiting to all requests
app.use(apiLimiter);

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN.split(',');
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// --- Database Connection ---
connectDB();

// --- Routes ---
// Map Key Endpoint is now handled in server.js for simplicity and security
app.get('/api/map-key', (req, res) => {
    const role = req.query.role || 'customer'; // Default to customer
    let key = process.env[`MAPTILER_${role.toUpperCase()}`];

    if (!key) {
        // Fallback or error for unconfigured keys
        return res.status(500).json({ message: `Map key not configured for role: ${role}` });
    }

    res.json({ key });
});

// Main application routes
app.use('/api', mainRouter);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --- Socket.IO Event Handlers ---
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join rooms based on user role (e.g., 'admin', 'driver-123', 'customer-456')
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    // Handle driver location broadcast
    socket.on('driverLocation', async (data) => {
        // Data should contain { userId, lat, lng }
        const { userId, lat, lng } = data;
        console.log(`Driver ${userId} location: ${lat}, ${lng}`);

        try {
            // 1. Update driver's location in the database
            const driver = await Driver.findOneAndUpdate(
                { userId: userId },
                { 'loc.lat': lat, 'loc.lng': lng, lastLocationUpdate: new Date() },
                { new: true }
            ).populate('currentOrderId');

            if (driver) {
                const driverUpdatePayload = {
                    userId: userId,
                    lat: lat,
                    lng: lng,
                    status: driver.status,
                    currentOrderId: driver.currentOrderId ? driver.currentOrderId.orderId : null,
                };

                // 2. Broadcast to the 'admin' room
                io.to('admin').emit('driverUpdate', driverUpdatePayload);

                // 3. Trigger ETA recomputation for any active orders
                if (driver.currentOrderId) {
                    // This should be debounced in a real app, but for now, we'll call it directly
                    await recomputeAndBroadcastETA(io, driver.currentOrderId._id);
                }
            }
        } catch (error) {
            console.error('Error handling driverLocation event:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Export for testing or other uses
module.exports = { app, server, io };
