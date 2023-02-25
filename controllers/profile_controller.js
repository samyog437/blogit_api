const Blog = require('../Model/Blog')

const getUserBlog = (req, res, next) => {
    const user_id = req.user.userId;
    Blog.find({user: user_id})
        .populate('user','username')
        .then((blogs) => {
            res.json(blogs);
        }).catch(next);
} 

module.exports = {
    getUserBlog,
}