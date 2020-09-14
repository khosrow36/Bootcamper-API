const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Add a course title']
    },
    description: {
        type: String,
        required: [true, 'Add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Add a number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Add a minimum skill'],
        enum: ['beginner', 'intermediate', 'description']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);