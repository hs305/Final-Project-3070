// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ error: 'Authorization token is required' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = authMiddleware;
