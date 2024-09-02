const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
router.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Validate input
        if (!(firstname && lastname && email && password)) {
            return res.status(400).json({ message: "All input fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please login" });
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        );

        // Save user token
        user.token = token;

        // Return new user
        res.status(201).json(user);
    } catch (err) {
        console.error("Registration error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation Error", details: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email already in use" });
        }
        res.status(500).json({ message: "Internal Server Error", details: err.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!(email && password)) {
            return res.status(400).json({ message: "All input fields are required" });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.SECRET_KEY,
                { expiresIn: "2h" }
            );

            // Save user token
            user.token = token;

            // Return user
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal Server Error", details: err.message });
    }
});

module.exports = router;