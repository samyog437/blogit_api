const express = require('express')
const bcrypt = require("bcryptjs")
const User = require('../Model/User')

const router = express.Router()

router.post('/register',(req, res, next) => {
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
                user.password = hash
                if(req.body.role) user.role = req.body.role
                user.save().then(user=>{
                    res.status(201).json({
                        'status': 'User has registered successfully',
                        userId: user._id,
                        username: user.username,
                        role: user.role
                    })
                }).catch(next)
            })
        }).catch(next)
})

module.exports = router