const Blog = require('../Model/Blog');
const User = require('../Model/User');

const getUserBlog = (req, res, next) => {
    const user_id = req.user.userId;
    Blog.find({user: user_id})
        .populate('user','username')
        .then((blogs) => {
            res.json(blogs);
        }).catch(next);
}

const getUserData = (req, res, next) => {
    const userId = req.user.userId;
    console.log(userId)
  
    User.findById(userId)
      .then((userData) => {
        if (!userData) {
          const error = new Error(`No user found with ID ${userId}`);
          error.status = 404;
          throw error;
        }
        res.json(userData);
      })
      .catch(next);
  };
  

module.exports = {
    getUserBlog,
    getUserData,
}