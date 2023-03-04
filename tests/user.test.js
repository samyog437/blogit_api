const supertest = require('supertest')
const app = require('../app')
const User = require('../Model/User')
const mongoose = require('mongoose')

const api = supertest(app)

const loginuser = {
    username: "testuser3",
    password: "password"
}

const registeruser = {
    username: "testuser3",
    password:"password",
    email:"testuser3@email.com"
}

const blog = {
    title: "This is title 1",
    content: "This is content 1"
}

beforeAll(async()=> {
    await User.deleteMany({})
})

test('User Registration', async() => {
    await api.post('/user/')
    .send(registeruser)
    .expect(201)
    .expect(res => {
        expect(res.body.status).toContain('User has registered successfully')
    })
})

test('User Login', async() => {
    await api.post('/user/login')
    .send(loginuser)
    .expect(200)
    .expect(res => {
        expect(res.body.status).toContain('User was logged in successfully')
    })

})

test('Blog create', async() => {
    await api.post('/blogs')
    .send(blog)
    .expect(201)
})

afterAll(async() => {
    await mongoose.connection.close()
})