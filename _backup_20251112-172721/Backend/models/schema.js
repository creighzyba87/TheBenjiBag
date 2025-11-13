const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- User Schema ---
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String, enum: ['admin', 'driver', 'customer'], default: 'customer', required: true },
    password: { type: String, required: true }, // Placeholder, should be hashed
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastSignedIn: { type: Date, default: Date.now },
});

// --- Product Schema ---
const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Stored in cents
    category: { type: String, required: true },
    inventory: { type: Number, default: 0 },
    imageUrl: { type: String },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// --- Order Schema ---
const OrderSchema = new Schema({
    orderId: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Price at time of order
    }],
    totalAmount: { type: Number, required: true }, // in cents
    status: { type: String, enum: ['pending', 'assigned', 'enroute', 'delivered', 'cancelled'], default: 'pending', required: true },
    deliveryAddress: { type: String, required: true },
    deliveryLat: { type: Number },
    deliveryLng: { type: Number },
    windowStart: { type: Date },
    windowEnd: { type: Date },
    assignedDriverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    nextUpLinkToken: { type: String },
    eta: { type: Date },
    appliedPromoCode: { type: String },
    appliedReferralCode: { type: String },
    discount: { type: Number, default: 0 }, // in cents
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// --- Driver Schema ---
const DriverSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['idle', 'enroute', 'delivering'], default: 'idle', required: true },
    currentOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    loc: {
        lng: { type: Number },
        lat: { type: Number },
    },
    lastLocationUpdate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// --- Referral Schema ---
const ReferralSchema = new Schema({
    code: { type: String, required: true, unique: true },
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    creditAmount: { type: Number, required: true }, // in cents
    usageCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// --- Address Schema ---
const AddressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// --- Transaction Schema ---
const TransactionSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true }, // in cents
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending', required: true },
    paymentMethod: { type: String },
    transactionId: { type: String },
    errorMessage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// --- Delivery History Schema ---
const DeliveryHistorySchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    status: { type: String, required: true },
    eta: { type: Date },
    actualDeliveryTime: { type: Date },
    driverLat: { type: Number },
    driverLng: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Driver = mongoose.model('Driver', DriverSchema);
const Referral = mongoose.model('Referral', ReferralSchema);
const Address = mongoose.model('Address', AddressSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const DeliveryHistory = mongoose.model('DeliveryHistory', DeliveryHistorySchema);

module.exports = {
    User,
    Product,
    Order,
    Driver,
    Referral,
    Address,
    Transaction,
    DeliveryHistory,
};
