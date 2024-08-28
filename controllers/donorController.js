const FoodPost = require('../models/FoodPost');
const path = require('path');

// Create a new food post
exports.createPost = async (req, res) => {
    try {
        const { description, latitude, longitude } = req.body;
        const imageUrl = path.join('/uploads', req.file.filename);
        const foodPost = new FoodPost({
            donor: req.user._id,
            description,
            imageUrl,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        await foodPost.save();
        res.status(201).json(foodPost);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create post' });
    }
};

// Get all posts created by the logged-in donor
exports.getPosts = async (req, res) => {
    try {
        const foodPosts = await FoodPost.find({ donor: req.user._id });
        res.status(200).json(foodPosts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit a food post
exports.editPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, latitude, longitude } = req.body;
        
        const foodPost = await FoodPost.findOneAndUpdate(
            { _id: id, donor: req.user._id },
            {
                description,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            },
            { new: true }
        );

        if (!foodPost) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        res.status(200).json(foodPost);
    } catch (error) {
        res.status(400).json({ error: 'Failed to edit post' });
    }
};

// Delete a food post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const foodPost = await FoodPost.findOneAndDelete({ _id: id, donor: req.user._id });

        if (!foodPost) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
