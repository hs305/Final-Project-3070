# FeedForward

FeedForward is a revolutionary platform that bridges the gap between food waste and food insecurity. Using real-time, location-based technology, FeedForward connects restaurants, groceries, and food services with surplus food to individuals and charities in need, ensuring that excess food is redirected to serve communities rather than landfills.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)


## Features

- **Donor Dashboard**: Donors can create, edit, and delete their own food posts. They can detect their current location or manually enter location data for their food posts.
- **Consumer Dashboard**: Consumers can search for nearby food posts using their current location or by specifying a search radius.
- **Authentication**: Secure login and registration for both donors and consumers using JWT authentication.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Location-Based Search**: Uses geolocation APIs to help donors and consumers connect easily.
- **Elegant UI**: Clean and modern interface with easy-to-use forms and components.

## Technology Stack

- **Frontend**: HTML, CSS, Bootstrap, JavaScript, EJS (Embedded JavaScript templates)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose for ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **APIs**: Custom RESTful APIs built with Express, Geocoding API for location services

## Getting Started

### Prerequisites

- Node.js and npm installed (v14 or higher recommended)
- MongoDB installed locally or an active MongoDB Atlas account
- Basic knowledge of command-line interface (CLI) operations

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/feedforward.git
   cd feedforward


2. Set up environemnt varibales:

   ```bash
   touch .env


3. Install the depedencies:

   ```bash
   npm install


4. Start the application:

   ```bash
   npm start

###

API Documentation

API documentation is available using Swagger. After running the server, you can access the API documentation at:


http://localhost:3000/api-docs

This documentation provides details about each endpoint, including the request and response structures, authentication requirements, and example requests.