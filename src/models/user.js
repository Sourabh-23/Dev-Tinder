const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,      
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female","others"].includes(value)) { 
                throw new Error("Invalid gender");
            }
        }
    },
    photourl: {
        type: String
    },
    about: {
        type: String,
        default: "This is default about the user"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true    // ← ye SECOND argument hai, schema fields ke bahar
});

module.exports = mongoose.model('User', userSchema);