const Blog = require("../Model/Blog")

const getAllComments = (req, res, next) => {
    Blog.findById(req.params.id)
    .then((blog) => {
        res.json(blog.comments)
    }).catch(next)
}

const createComment = (req, res, next) => {
    Blog.findById(req.params.id)
    .then((blog) => {
        let comment = {
            "body": req.body.body,
            "commenter_id": req.user.userId
        }
        blog.comments.push(comment)
        blog.save()
            .then((b) => res.status(201).json(b.comments))
    }).catch(next)
}

module.exports = {
    getAllComments,
    createComment,
}