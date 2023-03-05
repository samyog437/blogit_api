const Blog = require('../Model/Blog');
const User = require('../Model/User');
const bcrypt = require('bcryptjs');

const getUserBlog = (req, res, next) => {
    const userId = req.params.user_id;
    Blog.find({user: userId})
        .populate('user','username')
        .then((blogs) => {
            res.json(blogs);
        }).catch(next);
}

const getUserData = async(req, res, next) => {
    const userId = req.params.user_id;
    console.log(userId)

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

  const registerUser = (req, res, next) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(user != null){
                let err = new Error(`User ${req.body.username} already exists`)
                res.status(400)
                return next(err)
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) return next(err)
                user = new User()
                user.username = req.body.username
                user.email = req.body.email
                user.password = hash
                if(req.body.role) user.role = req.body.role
                if (req.file) user.image = req.file.path;
                user.save().then(user=>{
                    res.status(201).json({
                        'status': 'User has registered successfully',
                        userId: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        image: user.image,
                    })
                }).catch(next)
            })
        }).catch(next)
  }

  const getAllUsers = (req, res, next) => {
    User.find({})
    .then((users) => {
      console.log(users)
      res.json(users);
    }).catch(next)
  }

  const deleteAllUsers = (req, res, next) => {
    User.find({ role: { $ne: "Admin" } })
      .select("_id")
      .then((users) => {
        const userIds = users.map((user) => user._id);
        return Promise.all([
          User.deleteMany({ _id: { $in: userIds } }),
          Blog.deleteMany({ user: { $in: userIds } }),
        ]);
      })
      .then((result) => {
        res.status(200).json({
          message: `${result[0].deletedCount} users and ${result[1].deletedCount} blogs deleted successfully`,
        });
      })
      .catch(next);
  };
  
  const deleteAUser = (req, res, next) => {
    const userId = req.params.user_id;
  
    User.findOneAndDelete({ _id: userId, role: { $ne: "Admin" } })
      .then((user) => {
        if (!user) {
          let error = new Error("User not found or not authorized");
          error.statusCode = 404;
          throw error;
        }
        return Blog.deleteMany({ user: user._id });
      })
      .then((result) => {
        res.status(200).json({
          message: `${result.deletedCount} blogs and the user deleted successfully`,
        });
      })
      .catch(next);
  };
  

  
  
module.exports = {
    getUserBlog,
    getUserData,
    updateUser,
    registerUser,
    getAllUsers,
    deleteAllUsers,
    deleteAUser,
}