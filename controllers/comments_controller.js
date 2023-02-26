const Blog = require("../Model/Blog")

const getAllComments = (req, res, next) => {
    Blog.findById(req.params.id)
        .populate({
            path: 'comments',
            populate: {
                path: 'commenter_id',
                select: 'username'
            }
        })
        .then((blog) => {
            res.json(blog.comments)
        })
        .catch(next)
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

const deleteAllComments = (req, res, next) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            blog.comments = []
            blog.save()
                .then(b => res.json(b.comments))
        }).catch(next)
}

const getCommentById = (req, res, next) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            let comment = blog.comments
                .find((item) => item.id == req.params.commenter_id)
            res.json(comment)
        }).catch(next)
}

const updateCommentById = (req, res, next) => {
    Blog.findById(req.params.id)
        .then(blog => {
            let comment = blog.comments.id(req.params.commenter_id)
            if(comment.commenter_id != req.user.userId) {
                res.status(403)
                    return next(new Error('Not authorized'))
            }
            let updatedComments = blog.comments.map((item) => {
                if(item.id == req.params.commenter_id) {
                    if(item.commenter_id == req.user.userId)
                        item.body == req.body.body
                }
                return item
            })
            blog.comments = updatedComments
            blog.save().then(b => res.json(b.comments))
        }).catch(next)
}

const deleteCommentById = (req, res, next) => {
    Blog.findById(req.params.id)
        .then(blog => {
            comment = blog.comments.find((item) => item.id == req.params.commenter_id)
            if(comment.user == req.user.userId) {
                let deletedComments = blog.comments.filter((item) => {
                        if(item.commenter_id == req.user.userId)
                    return item.id != req.params.commenter_id
                })
                blog.comments = deletedComments
                blog.save().then(b => res.json(b.comments))
            } else {
                res.status(400).send({"reply": "You are not authorized"})
            }
        }).catch(next)
}

module.exports = {
    getAllComments,
    createComment,
    deleteAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById
}