const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Add a name']
    },
    email: {
        type: String,
        required: [true, 'Add an email'],
        unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Encrypt password
UserSchema.pre('save', async function (next) {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);