const mongoose = require('mongoose')

const spaceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    spaceId: {
        type: String,
        unique: true,
        required: [true, 'Please add a spaceId']
    },
    spaceName: {
        type: String,
        required: [true, 'Please add a space name']
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Spaces', spaceSchema)