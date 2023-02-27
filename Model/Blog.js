const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    commenter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    commenterName: {
        type: String,
    },
})

const blogSchema = mongoose.Schema({
    image: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    view: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Blog', blogSchema)