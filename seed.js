// seed.js

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const User = require('./models/User');
const FoodPost = require('./models/FoodPost');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

const seedData = async () => {
    // Clear existing data from collections instead of dropping the database
    await User.deleteMany({});
    await FoodPost.deleteMany({});

    const users = [];
    const foodPosts = [];

    const baseLatitude = 12.929191;
    const baseLongitude = 77.6335368;

    for (let i = 0; i < 10; i++) {
        const donor = new User({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'donor',
        });
        users.push(donor);

        const consumer = new User({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'consumer',
        });
        users.push(consumer);
    }

    await User.insertMany(users);

    const getRandomLocation = (baseLat, baseLng, maxDistanceKm) => {
        const randomDistance = Math.random() * maxDistanceKm;
        const randomAngle = Math.random() * Math.PI * 2;

        const deltaLat = randomDistance * Math.cos(randomAngle) / 111;
        const deltaLng = randomDistance * Math.sin(randomAngle) / (111 * Math.cos(baseLat * (Math.PI / 180)));

        return {
            latitude: baseLat + deltaLat,
            longitude: baseLng + deltaLng,
        };
    };

    for (let i = 0; i < 20; i++) {
        const location = getRandomLocation(baseLatitude, baseLongitude, 1000); // Max 1000 km

        const foodPost = new FoodPost({
            donor: users[i % 10]._id,
            description: faker.lorem.sentence(),
            imageUrl: faker.image.food(),
            location: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude],
            },
        });
        foodPosts.push(foodPost);
    }

    await FoodPost.insertMany(foodPosts);

    console.log('Database seeded successfully!');
    mongoose.connection.close();
};

seedData();
