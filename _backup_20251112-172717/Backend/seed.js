const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Product, Driver } = require('./models/schema'); // Import Mongoose models
const bcrypt = require('bcryptjs'); // Need to install this package

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const mockProducts = [
    { name: 'Top Shelf Indica (0.5 oz)', price: 10000, category: 'Flower', inventory: 50 }, // $100.00 in cents
    { name: 'Premium Sativa (0.5 oz)', price: 10000, category: 'Flower', inventory: 50 }, // $100.00 in cents
    { name: 'Sativa Concentrate (7g)', price: 15000, category: 'Concentrate', inventory: 30 }, // $150.00 in cents
    { name: 'Indica Concentrate (7g)', price: 15000, category: 'Concentrate', inventory: 30 }, // $150.00 in cents
    { name: 'Sativa Live Resin Vape Pen (1g)', price: 6000, category: 'Vape', inventory: 40 }, // $60.00 in cents
    { name: 'Indica Live Resin Vape Pen (1g)', price: 6000, category: 'Vape', inventory: 40 }, // $60.00 in cents
];

const mockUsers = [
    { name: 'Admin User', email: 'admin@benjibag.com', phone: '555-123-4567', role: 'admin', password: 'password123' },
    { name: 'Driver One', email: 'driver1@benjibag.com', phone: '555-987-6543', role: 'driver', password: 'password123' },
    { name: 'Customer A', email: 'customerA@benjibag.com', phone: '555-555-1111', role: 'customer', password: 'password123', referralCode: 'CUSTA123', referredBy: null },
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for seeding.');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        await Driver.deleteMany({});
        console.log('Existing data cleared.');

        // Seed Products
        await Product.insertMany(mockProducts);
        console.log('Products seeded successfully.');

        // Seed Users with hashed passwords
        const usersToInsert = await Promise.all(mockUsers.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        const insertedUsers = await User.insertMany(usersToInsert);
        console.log('Users seeded successfully.');

        // Update the driver's driver-specific data
        const driverUser = insertedUsers.find(u => u.email === 'driver1@benjibag.com');
        if (driverUser) {
            await Driver.create({
                userId: driverUser._id,
                status: 'idle',
                currentOrderId: null,
                loc: { lng: -117.8200, lat: 33.8800 } // Near Yorba Linda office
            });
            console.log('Driver data initialized.');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

seedDB();
