const express = require('express');
const { createPost, getPosts, editPost, deletePost } = require('../controllers/donorController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Donor
 *   description: Donor-related endpoints
 */

/**
 * @swagger
 * /donor/createPost:
 *   post:
 *     summary: Create a new food post
 *     tags: [Donor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The food post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodPost'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
router.post('/createPost', authMiddleware, upload.single('image'), createPost);

/**
 * @swagger
 * /donor/getPosts:
 *   get:
 *     summary: Get all posts created by the logged-in donor
 *     tags: [Donor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of food posts created by the donor
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
router.get('/getPosts', authMiddleware, getPosts);

/**
 * @swagger
 * /donor/editPost/{id}:
 *   put:
 *     summary: Edit a food post created by the logged-in donor
 *     tags: [Donor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: The food post was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodPost'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Post not found or unauthorized
 */
router.put('/editPost/:id', authMiddleware, editPost);

/**
 * @swagger
 * /donor/deletePost/{id}:
 *   delete:
 *     summary: Delete a food post created by the logged-in donor
 *     tags: [Donor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: The food post was successfully deleted
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Post not found or unauthorized
 */
router.delete('/deletePost/:id', authMiddleware, deletePost);





router.get('/dashboard', (req, res) => {
    // Render the donorDashboard.ejs template
    res.render('donorDashboard', { user: req.user });
});

module.exports = router;