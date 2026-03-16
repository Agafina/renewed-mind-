const mongoose = require('mongoose');

const registrantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Registrant', registrantSchema);
