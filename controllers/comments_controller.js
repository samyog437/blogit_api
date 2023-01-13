const Blog = require("../Model/Blog")

const getAllComments = (req, res, next) => {
    Blog.findById(req.params.id)
    .then((blog) => {
        res.json(blog.comments)
    }).catch(next)
}
