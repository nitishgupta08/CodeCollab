const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Please add a email']
    },
    name: {
        type: String,
        required: [true, 'Please add a user name']
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    favouriteLang: {
        type: String,
        default: "js"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);