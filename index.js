const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3001

mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => {
        console.log('Connected to database')
        app.listen(port, () => {
            console.log(`App is running on port: ${port}`)
        })
    }).catch((err) => console.log(err))