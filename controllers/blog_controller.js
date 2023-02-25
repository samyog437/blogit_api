const Blog = require('../Model/Blog')

const getAllBlogs = (req, res, next) => {
    Blog.find()
    .populate('user','username')
        .then((blogs) => {
            res.json(blogs)
        }).catch(next)
}

const getAllUserBlogs = (req, res, next) => {
    const user_id = req.params.userId;
    Blog.find({'user':user_id})
    .populate('user','username')
        .then((blogs) => {
            res.json(blogs)
        }).catch(next);
}

const createBlog = (req,res,next) => {
    let blog = {
        image: req.file.filename,
        title: req.body.title,
        content: req.body.content,
        user: req.user.userId
    }
    console.log(blog)
    Blog.create(blog)
        .then((blog) => {
            res.status(201).json(blog)
        }).catch(next)
}

// const updateBlogById = (req, res, next) => {
//     Blog.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
//         .then((blog) => {
//             console.log(blog)
//             res.json(blog)
//         }).catch(next)
// }

const updateBlogById = (req, res, next) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            if (blog.user.toString() !== req.user.userId) {
                let err = new Error('You are not authorized to update this blog post')
                res.status(403)
                return next(err)
            }

            Blog.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
                .then((blog) => {
                    console.log(blog)
                    res.json(blog)
                }).catch(next)
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
        .populate('user','username')
        .then((blog) => {
            const username = blog.user.username;
            console.log("Username:", username);
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
    // getAllUserBlogs,
    updateBlogById,
    deleteAllBlogs,
    getABlog,
    deleteABlog,
}