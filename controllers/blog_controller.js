const Blog = require('../Model/Blog')

const getAllBlogs = (req, res, next) => {
    Blog.find()
        .then((blogs) => {
            res.json(blogs)
        }).catch(next)
}

const createBlog = (req,res,next) => {
    let blog = {
        'title': req.body.title,
        'content': req.body.content
    }
    Blog.create(blog)
        .then((blog) => {
            res.status(201).json(blog)
        }).catch(next)
}

module.exports = {
    createBlog,
    getAllBlogs,
}