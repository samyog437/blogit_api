require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const user_router = require('./routes/user_routes')
const blog_router = require('./routes/blog_routes')
const category_router = require('./routes/category_routes')
const profile_router = require('./routes/profile_routes')
const auth = require('./middleware/auth')

const app = express()
app.use(cors())

const DB_URI = (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DB_URI
    : process.env.DB_URI

console.log(DB_URI)

mongoose.connect(DB_URI)
    .then(() => {
        console.log('connected')
    }).catch((err) => console.log(err))

app.use(express.json())


app.use('/user', user_router)
app.use('/blogs', blog_router)
app.use('/category', category_router)
app.use('/profile', auth.verifyUser, profile_router)

app.use('/image', express.static('uploads'))


app.use((err, req, res, next) => {
    console.log(err.stack)
    if (res.statusCode == 200) res.status(500)
    res.json({"msg": err.message})
})

module.exports = app