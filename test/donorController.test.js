const donorController = require('../controllers/donorController');
const FoodPost = require('../models/FoodPost');

jest.mock('../models/FoodPost');

describe('Donor Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { _id: 'donorId' },
            body: {},
            file: { filename: 'test.jpg' },
            params: { id: 'postId' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

   
    describe('getPosts', () => {
        it('should get all posts created by the logged-in donor', async () => {
            const foodPosts = [{ _id: 'postId1' }, { _id: 'postId2' }];
            FoodPost.find = jest.fn().mockResolvedValue(foodPosts);

            await donorController.getPosts(req, res);

            expect(FoodPost.find).toHaveBeenCalledWith({ donor: req.user._id });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(foodPosts);
        });

        it('should handle errors when getting posts', async () => {
            FoodPost.find = jest.fn().mockRejectedValue(new Error('Server error'));

            await donorController.getPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('editPost', () => {
        it('should edit a food post successfully', async () => {
            req.body = { description: 'Updated description', latitude: 15, longitude: 25 };
            const updatedPost = { _id: 'postId', ...req.body };
            FoodPost.findOneAndUpdate = jest.fn().mockResolvedValue(updatedPost);

            await donorController.editPost(req, res);

            expect(FoodPost.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: req.params.id, donor: req.user._id },
                {
                    description: req.body.description,
                    location: {
                        type: 'Point',
                        coordinates: [req.body.longitude, req.body.latitude]
                    }
                },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedPost);
        });

        it('should return a 404 error if the post is not found or unauthorized', async () => {
            FoodPost.findOneAndUpdate = jest.fn().mockResolvedValue(null);

            await donorController.editPost(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Post not found or unauthorized' });
        });

        it('should return an error when failing to edit a post', async () => {
            FoodPost.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Failed to edit post'));

            await donorController.editPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to edit post' });
        });
    });

    describe('deletePost', () => {
        it('should delete a food post successfully', async () => {
            const deletedPost = { _id: 'postId' };
            FoodPost.findOneAndDelete = jest.fn().mockResolvedValue(deletedPost);

            await donorController.deletePost(req, res);

            expect(FoodPost.findOneAndDelete).toHaveBeenCalledWith({ _id: req.params.id, donor: req.user._id });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
        });

        it('should return a 404 error if the post is not found or unauthorized', async () => {
            FoodPost.findOneAndDelete = jest.fn().mockResolvedValue(null);

            await donorController.deletePost(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Post not found or unauthorized' });
        });

        it('should return an error when failing to delete a post', async () => {
            FoodPost.findOneAndDelete = jest.fn().mockRejectedValue(new Error('Server error'));

            await donorController.deletePost(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });
});
