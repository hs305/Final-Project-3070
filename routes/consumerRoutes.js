const express = require('express');
const { getNearbyPosts, renderConsumerDashboard } = require('../controllers/consumerController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Consumer
 *   description: Consumer-related endpoints
 */

/**
 * @swagger
 * /consumer/nearbyPosts:
 *   get:
 *     summary: Get nearby food posts based on location
 *     tags: [Consumer]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the consumer
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the consumer
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *         required: true
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: A list of nearby food posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FoodPost'
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.get('/nearbyPosts', getNearbyPosts);

// Route to render the consumer dashboard
router.get('/dashboard', renderConsumerDashboard);

module.exports = router;
