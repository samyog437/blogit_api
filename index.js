require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const user_router = require('./routes/user_routes')

const app = express()
const port = 3001

mongoose.connect('mongodb://127.0.0.1:27017/blogit')
    .then(() => {
        console.log('Connected to database')
        app.listen(port, () => {
            console.log(`App is running on port: ${port}`)
        })
    }).catch((err) => console.log(err))

app.use(express.json())


app.use('/user', user_router)



app.use((err, req, res, next) => {
    console.log(err.stack)
    if (res.statusCode == 200) res.status(500)
    res.json({"msg": err.message})
})    