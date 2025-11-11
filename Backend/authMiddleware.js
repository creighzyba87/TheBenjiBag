const jwt = require('jsonwebtoken');
const User = require('../models/schema').User;

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Forbidden. User not authenticated.' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ message: `Forbidden. Requires ${role} role.` });
        }
        next();
    };
};

module.exports = {
    requireAuth,
    requireRole,
};
