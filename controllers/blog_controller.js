const Blog = require('../Model/Blog')

const getAllBlogs = (req, res, next) => {
    Blog.find()
        .then((blogs) => {
            res.json(blogs)
        }).catch(next)
}

const createBlog = (req,res,next) => {
    let blog = {
        image: req.file.filename,
        title: req.body.title,
        content: req.body.content
    }
    Blog.create(blog)
        .then((blog) => {
            res.status(201).json(blog)
        }).catch(next)
}

const updateBlogById = (req, res, next) => {
    Blog.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then((blog) => {
            console.log(blog)
            res.json(blog)
        }).catch(next)
}

const deleteAllBlogs = (req, res, next) => {
    Blog.deleteMany()
        .then((blog) => {
            res.json(blog)
        }).catch(next)
}

const getABlog = (req, res, next) => {
    console.log("getABlog function called"); // add this line
    Blog.findByIdAndUpdate(
        req.params.id,
        {$inc: {view:1}},
        {new: true}
        )
        .populate('category')
        .then((blog) => {
            console.log("Updated blog:", blog);
            res.json(blog)
        }).catch(next)  
}

const deleteABlog = (req, res, next) => {
    Blog.findByIdAndDelete(req.params.id)
        .then((blog) => {
            res.json(blog)
        }).catch(next)
}

module.exports = {
    createBlog,
    getAllBlogs,
    updateBlogById,
    deleteAllBlogs,
    getABlog,
    deleteABlog,
}