const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Username should be longer than 3 characters']
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Author','Reader'],
        default: 'Reader'
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)