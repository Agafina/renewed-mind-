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
    level: {
        type: String,
        required: [true, 'Level is required'],
        trim: true,
        enum: {
            values: ['200', '300', '400', '500', '600'],
            message: 'Level must be 200, 300, 400, 500, or 600',
        },
    },
    contact: {
        type: String,
        required: [true, 'Contact is required'],
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('Registrant', registrantSchema);
