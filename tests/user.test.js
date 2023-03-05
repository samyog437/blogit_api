const supertest = require('supertest')
const app = require('../app')
const User = require('../Model/User')
const Blog = require('../Model/Blog');
const mongoose = require('mongoose')
const { response } = require('../app')

const api = supertest(app)

let token;

const loginuser = {
    username: "testuser3",
    password: "password"
}

const registeruser = {
    username: "testuser3",
    password:"password",
    email:"testuser3@email.com",
    role: "Admin"
}

const blog = {
    title: "This is title 1",
    content: "This is content 1"
}

beforeAll(async()=> {
    await User.deleteMany({})
    await Blog.deleteMany({})
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

test('Blog create', async () => {
    const loginResponse = await api.post('/user/login').send(loginuser);
    token = loginResponse.body.token;

    await api.post('/blogs')
    .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect(res => {
        expect(res.body.status).toContain('Blog has been created successfully');
        expect(res.body.blog).toHaveProperty('title', blog.title);
      });
  });

  test('Get All Blogs', async() => {
    await api.get('/blogs')
    .expect(200)
    expect(res => {
        expect(res.body).toBeInstanceOf(Array)
    });
  })

  test('Get A Blog', async() => {
    const createdBlog = await Blog.findOne({title: blog.title});

    await api.get(`/blogs/${createdBlog._id}`)
    .expect(200)
    .expect(res => {
        expect(res.body.title).toEqual(blog.title)
    })
  })

  test('Update Blog', async () => {
    const loginResponse = await api.post('/user/login').send(loginuser);
    token = loginResponse.body.token;
  
    const createdBlog = await Blog.findOne({title: blog.title});
  
    const updatedBlog = {
      title: 'Updated Title',
      content: 'Updated Content',
    };
  
    await api.put(`/blogs/${createdBlog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect(res => {
        expect(res.body.title).toEqual(updatedBlog.title);
        expect(res.body.content).toEqual(updatedBlog.content);
      });
  });

  test('Get blogs for user', async () => {
    const loginResponse = await api.post('/user/login').send(loginuser);
    token = loginResponse.body.token;
    
    const createdUser = await User.findOne({username: loginuser.username});
    console.log('createdUser:', createdUser);
    const createdBlogs = await Blog.find({user: createdUser._id});
    console.log('createdBlogs:', createdBlogs)
    await api.get(`/profile/${createdUser._id}/blogs`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveLength(createdBlogs.length);
        res.body.forEach((blog, index) => {
          expect(blog).toHaveProperty('title', createdBlogs[index].title);
          expect(blog).toHaveProperty('content', createdBlogs[index].content);
          expect(blog).toHaveProperty('user');
          expect(blog.user).toHaveProperty('username', createdUser.username);
        })
      });
  });

  test('Delete Blog', async () => {
    const loginResponse = await api.post('/user/login').send(loginuser);
    token = loginResponse.body.token;
  
    const createdBlog = await Blog.findOne({title: 'Updated Title'});
  
    await api.delete(`/blogs/${createdBlog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.status).toContain('Blog has been deleted successfully');
      });
  });

  test('Get User Data', async () => {
    const createdUser = await User.findOne({ username: registeruser.username });
    await api.get(`/user/${createdUser._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.username).toEqual(createdUser.username);
        expect(res.body.email).toEqual(createdUser.email);
        expect(res.body.role).toEqual(createdUser.role);
      });
  });

  test('Update User', async () => {
    const loginResponse = await api.post('/user/login').send(loginuser);
    token = loginResponse.body.token;
  
    const createdUser = await User.findOne({username: loginuser.username});
  
    const updatedUser = {
      username: 'UpdatedUsername',
      email: 'updated-email@example.com',
      password: 'newpassword'
    };
  
    await api.put(`/user/${createdUser._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUser)
      .expect(200)
      .expect(res => {
        expect(res.body.data).toHaveProperty('username', updatedUser.username);
        expect(res.body.data).toHaveProperty('email', updatedUser.email);
      });
  });  

afterAll(async() => {
    await mongoose.connection.close()
})