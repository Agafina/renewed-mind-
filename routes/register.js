const express = require('express');
const router = express.Router();
const Registrant = require('../models/Registrant');

// POST /api/register - Register a new attendee
router.post('/register', async (req, res) => {
    try {
        const { name, email, level, contact, department } = req.body;
        if (!name || !email || !level || !contact || !department) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        // Normalize email before duplicate check and save
        const normalizedEmail = email.trim().toLowerCase();
        // Check if email already registered
        const existing = await Registrant.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ success: false, message: 'This email is already registered.' });
        }
        const registrant = new Registrant({ name, email: normalizedEmail, level, contact, department });
        await registrant.save();
        res.status(201).json({
            success: true,
            message: `🎉 Thank you, ${name}! You've been successfully registered.`,
            data: { name: registrant.name, email: registrant.email, registeredAt: registrant.registeredAt },
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
        }
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// GET /api/registrants - Retrieve all registrants (admin)
router.get('/registrants', async (req, res) => {
    try {
        const registrants = await Registrant.find().sort({ registeredAt: -1 });
        res.json({ success: true, count: registrants.length, data: registrants });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
