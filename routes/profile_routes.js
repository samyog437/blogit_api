const express = require('express')
const Profile = require('../Model/Profile')
const router = express.Router()
const upload = require('../middleware/upload')
const { verifyUser } = require('../middleware/auth')
const profile_controller = require('../controllers/profile_controller')

// router.route('/')
// .get((req, res, next) => {
//     Profile.find()
//     .then(profiles => res.json(profiles))
//     .catch(next)
// })

// .post(upload.single("profile"), (req, res, next) => {
//     console.log(req.file)
//     console.log(req.body)
//     let profile = {
//         ...req.body,
//         image: req.file.filename,
//         user: req.user_id
//     }
//     Profile.create(profile)
//     .then(profile => res.json(profile))
//     .catch(next)
// })

router.route('/:user_id/blogs')
    .get(profile_controller.getUserBlog)

module.exports = router