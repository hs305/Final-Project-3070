const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

// controllers/authController.js

exports.logout = async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) {
                return res.status(500).send({ error: 'Failed to log out' });
            }
            res.status(200).send({ message: 'Successfully logged out' });
        });
    } catch (error) {
        res.status(500).send({ error: 'Server error during logout' });
    }
};

