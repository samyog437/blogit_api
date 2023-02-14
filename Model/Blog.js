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
    }
})

const blogSchema = mongoose.Schema({
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
    }
}, {timestamps: true});

module.exports = mongoose.model('Blog', blogSchema)