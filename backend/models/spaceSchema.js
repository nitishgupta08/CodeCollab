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

    activeUsers: {
        type: [{
            id: String,
            name: String,
            incoming: Boolean
        }]
    },

    spaceData: {
        type: [{
            id: String,
            fileName: String,
            fileData: String,
            lang: String
        }]
    }


}, {
    timestamps: true
})

module.exports = mongoose.model('Spaces', spaceSchema)