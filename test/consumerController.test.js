const consumerController = require('../controllers/consumerController');
const FoodPost = require('../models/FoodPost');

jest.mock('../models/FoodPost');

describe('Consumer Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { _id: 'consumerId' },
            query: { latitude: 12.9716, longitude: 77.5946, radius: 5 }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn()
        };
    });

    describe('getNearbyPosts', () => {
        it('should return an error if latitude, longitude, or radius is missing', async () => {
            req.query = { latitude: 12.9716, longitude: 77.5946 }; // Missing radius

            await consumerController.getNearbyPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Latitude, longitude, and radius are required' });
        });

        it('should fetch nearby food posts successfully', async () => {
            const mockPosts = [
                { _id: 'postId1', description: 'Food post 1', donor: { name: 'Donor 1' } },
                { _id: 'postId2', description: 'Food post 2', donor: { name: 'Donor 2' } }
            ];

            FoodPost.find.mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce(mockPosts)
            });

            await consumerController.getNearbyPosts(req, res);

            expect(FoodPost.find).toHaveBeenCalledWith({
                location: {
                    $geoWithin: {
                        $centerSphere: [[77.5946, 12.9716], 5 * 1000 / 6378100]
                    }
                }
            });
            expect(res.json).toHaveBeenCalledWith(mockPosts);
        });

        it('should handle server errors when fetching nearby posts', async () => {
            FoodPost.find.mockReturnValueOnce({
                populate: jest.fn().mockRejectedValueOnce(new Error('Server error'))
            });

            await consumerController.getNearbyPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('renderConsumerDashboard', () => {
        it('should render the consumer dashboard with the user', () => {
            req.user = { name: 'Consumer User', _id: 'consumerId' };

            consumerController.renderConsumerDashboard(req, res);

            expect(res.render).toHaveBeenCalledWith('consumerDashboard', { user: req.user });
        });

        it('should render the consumer dashboard without a user if not logged in', () => {
            req.user = null;

            consumerController.renderConsumerDashboard(req, res);

            expect(res.render).toHaveBeenCalledWith('consumerDashboard', { user: null });
        });
    });
});
