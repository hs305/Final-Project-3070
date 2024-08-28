const FoodPost = require('../models/FoodPost');
const path = require('path');

// Controller to fetch nearby food posts
exports.getNearbyPosts = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
        }

        const radiusInMeters = radius * 1000; // Convert radius to meters

        const foodPosts = await FoodPost.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radiusInMeters / 6378100]
                }
            }
        }).populate('donor', 'name'); // Populate the donor field with the name

        res.json(foodPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller to render the consumer dashboard
exports.renderConsumerDashboard = (req, res) => {
    res.render('consumerDashboard', {
        user: req.user || null
    });
};
