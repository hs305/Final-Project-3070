const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const consumerRoutes = require('./routes/consumerRoutes');

dotenv.config();

// Initialize app
const app = express();
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Session and Passport configuration
require('./config/auth0Strategy')(passport);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/donor', donorRoutes);
app.use('/consumer', consumerRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// EJS views
app.get("/", (req, res) => res.render("index"));
app.get('/about', (req, res) => res.render('about.ejs'));
app.get('/services', (req, res) => res.render('services.ejs'));
app.get('/contact', (req, res) => res.render('contact.ejs'));
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('dashboard.ejs');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
