const express = require('express')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require('../Model/User')
const { verifyUser, verifyAdmin } = require('../middleware/auth')
const profile_controller = require('../controllers/profile_controller')
const blog_controller = require('../controllers/blog_controller')

const upload = require('../middleware/upload')

const router = express.Router()

router.route('/')
    .post(upload.single('image'), profile_controller.registerUser)

router.post('/login', (req,res,next) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(user==null){
                let err = new Error(`User ${req.body.username} has not been registered`)
                res.status(404)
                return next(err)
            }
            bcrypt.compare(req.body.password, user.password, (err, status) => {
                if(err) return next(err)
                if(!status) {
                    let err = new Error('Password does not match')
                    res.status(401)
                    return next(err)
                }
                let data = {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
                jwt.sign(data, process.env.SECRET,
                    {'expiresIn': '30d'}, (err, token) => {
                        if(err) return next(err)
                        res.json({
                            userId: user._id,
                            'status': 'User was logged in successfully',
                            token: token
                        })
                    })
            })
        }).catch(next)
})


router.route('/:user_id')
    .get(profile_controller.getUserData)
    .put(verifyUser, profile_controller.updateUser)

router.use(verifyUser, verifyAdmin)
    .route('/admin/blogs')
    .get(blog_controller.getAllBlogs)
    .delete(blog_controller.deleteAllBlogs)

router.use(verifyUser, verifyAdmin)
    .route('/admin/blogs/:id')
    .get(blog_controller.deleteABlog)

router.use(verifyUser, verifyAdmin)
    .route('/admin/manageusers')
    .get(profile_controller.getAllUsers)
    .delete(profile_controller.deleteAllUsers)

router.use(verifyUser, verifyAdmin)
    .route('/admin/manageusers/:user_id')
    .delete(profile_controller.deleteAUser)



module.exports = router