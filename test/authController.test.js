// test/authController.test.js
const jwt = require('jsonwebtoken');
const { register, login, logout } = require('../controllers/authController');
const User = require('../models/User');

jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user and return token', async () => {
            const req = {
                body: { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            const userStub = jest.spyOn(User.prototype, 'save').mockResolvedValueOnce();
            const jwtStub = jwt.sign.mockReturnValueOnce('fakeToken');

            await register(req, res);

            expect(userStub).toHaveBeenCalled();
            expect(jwtStub).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ token: 'fakeToken' }));
        });

        it('should return 400 if there is an error', async () => {
            const req = {
                body: { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            jest.spyOn(User.prototype, 'save').mockRejectedValueOnce(new Error('Save failed'));

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('login', () => {
        it('should log in an existing user and return token', async () => {
            const req = {
                body: { email: 'john@example.com', password: 'password123' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const userMock = {
                _id: 'fakeUserId',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValueOnce(userMock);
            jwt.sign.mockReturnValueOnce('fakeToken');

            await login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(userMock.comparePassword).toHaveBeenCalledWith('password123');
            expect(jwt.sign).toHaveBeenCalledWith({ id: userMock._id }, process.env.JWT_SECRET);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ token: 'fakeToken' }));
        });

        it('should return 400 if login credentials are invalid', async () => {
            const req = {
                body: { email: 'john@example.com', password: 'wrongpassword' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            User.findOne.mockResolvedValueOnce(null);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid login credentials' }));
        });
    });

    describe('logout', () => {
        it('should log out the user', async () => {
            const req = {
                logout: jest.fn((callback) => callback())
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await logout(req, res);

            expect(req.logout).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'Successfully logged out' }));
        });

        it('should handle logout errors', async () => {
            const req = {
                logout: jest.fn((callback) => callback(new Error('Logout failed')))
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await logout(req, res);

            expect(req.logout).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: 'Failed to log out' }));
        });
    });
});
