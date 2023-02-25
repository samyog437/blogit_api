const supertest = require('supertest')
const app = require('../app')
const User = require('../Model/User')
const mongoose = require('mongoose')

const api = supertest(app)

const user = {
    username: "testuser1",
    password: "password"
}

beforeAll(async()=> {
    await User.deleteMany({})
})

test('User Registration', async() => {
    await api.post('/user/')
    .send(user)
    .expect(201)
    .expect(res => {
        expect(res.body.status).toContain('User has registered successfully')
    })
})

afterAll(async() => {
    await mongoose.connection.close()
})