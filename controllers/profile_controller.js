const Blog = require('../Model/Blog');
const User = require('../Model/User');
const bcrypt = require('bcryptjs');

const getUserBlog = (req, res, next) => {
    const user_id = req.user.userId;
    Blog.find({user: user_id})
        .populate('user','username')
        .then((blogs) => {
            res.json(blogs);
        }).catch(next);
}

const getUserData = async(req, res, next) => {
    const userId = req.params.user_id;
    console.log(userId)
  
    // User.findById(userId)
    //   .then((userData) => {
    //     if (!userData) {
    //       const error = new Error(`No user found with ID ${userId}`);
    //       error.status = 404;
    //       throw error;
    //     }
    //     res.status(200).json(userData);
    //   })
    //   .catch(next);

      try {
        const userData = await User.findById({ _id: userId });
        if (!userData) {
          const error = new Error(`No user found with ID ${userId}`);
          error.status = 404;
          throw error;
        }
        res.status(200).json(userData);
      } catch (err) {
        res.status(500).json({ success: false });
      }
      

  //   try {
  //     const user = await User.find({ _id: req.params.user_id})
  //     console.log(user)
  //     res.status(200).json({data: user})        
  //   // res.status(201).json(user) 
  // } catch (err) {res.status(500).json({success: false})}
  };

  const updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user_id) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      let updateFields = { username, email };
      if (password) {
        updateFields.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        updateFields,
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ data: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  
module.exports = {
    getUserBlog,
    getUserData,
    updateUser,
}