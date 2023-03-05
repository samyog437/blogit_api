const express = require('express')
const Profile = require('../Model/Profile')
const router = express.Router()
const upload = require('../middleware/upload')
const { verifyUser } = require('../middleware/auth')
const profile_controller = require('../controllers/profile_controller')

router.route('/:user_id/blogs')
    .get(profile_controller.getUserBlog)

module.exports = router