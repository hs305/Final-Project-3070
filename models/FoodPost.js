const mongoose = require('mongoose');

const FoodPostSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    createdAt: { type: Date, default: Date.now }
});

// Create a 2dsphere index on the location field for geospatial queries
FoodPostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FoodPost', FoodPostSchema);
