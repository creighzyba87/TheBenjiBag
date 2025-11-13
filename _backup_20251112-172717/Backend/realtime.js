const { Order, Driver, DeliveryHistory } = require('./models/schema');

// Mock function for ETA calculation
// In a real application, this would use a mapping service API (e.g., MapTiler Directions API)
const calculateETA = async (driverLocation, orderDestination) => {
    // Simple Haversine distance calculation (in km)
    const R = 6371; // Radius of Earth in km
    const dLat = (orderDestination.lat - driverLocation.lat) * (Math.PI / 180);
    const dLon = (orderDestination.lng - driverLocation.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(driverLocation.lat * (Math.PI / 180)) * Math.cos(orderDestination.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    // Assume average driving speed of 40 km/h (approx 25 mph)
    const avgSpeedKmh = 40;
    const timeInHours = distanceKm / avgSpeedKmh;
    const timeInMinutes = Math.round(timeInHours * 60);

    // Add a buffer for traffic/delivery time (e.g., 10 minutes)
    const totalTimeMinutes = timeInMinutes + 10;

    const eta = new Date(Date.now() + totalTimeMinutes * 60000);
    return { eta, distanceKm, totalTimeMinutes };
};

// Function to recompute ETA and broadcast updates
const recomputeAndBroadcastETA = async (io, orderId) => {
    try {
        const order = await Order.findById(orderId).populate('assignedDriverId');
        if (!order || !order.assignedDriverId) {
            console.log(`Order ${orderId} not found or no driver assigned. Skipping ETA recomputation.`);
            return;
        }

        const driver = await Driver.findOne({ userId: order.assignedDriverId._id });
        if (!driver || !driver.loc || !driver.loc.lat || !driver.loc.lng) {
            console.log(`Driver ${order.assignedDriverId._id} location not available. Skipping ETA recomputation.`);
            return;
        }

        const orderDestination = {
            lat: order.deliveryLat,
            lng: order.deliveryLng,
        };

        const driverLocation = {
            lat: driver.loc.lat,
            lng: driver.loc.lng,
        };

        const { eta, totalTimeMinutes } = await calculateETA(driverLocation, orderDestination);

        // 1. Update Order in DB
        order.eta = eta;
        await order.save();

        // 2. Log to Delivery History
        await DeliveryHistory.create({
            orderId: order._id,
            driverId: driver._id,
            status: 'ETA_UPDATE',
            eta: eta,
            driverLat: driverLocation.lat,
            driverLng: driverLocation.lng,
        });

        const updatePayload = {
            orderId: order.orderId,
            status: order.status,
            eta: eta.toISOString(),
            minutes: totalTimeMinutes,
            driverLocation: driverLocation,
        };

        // 3. Broadcast to Admin Room
        io.to('admin').emit('orderUpdate', updatePayload);

        // 4. Broadcast to Customer Room (if they are tracking)
        io.to(`customer-${order.customerId}`).emit('orderUpdate', updatePayload);

        console.log(`ETA recomputed for Order ${order.orderId}: ${totalTimeMinutes} minutes.`);

    } catch (error) {
        console.error('Error in recomputeAndBroadcastETA:', error);
    }
};

module.exports = {
    recomputeAndBroadcastETA,
    calculateETA,
};
