const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Muista exportata app.js:stä
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Test blog 1',
    author: 'Test author 1',
    url: 'http://testblog1.com',
    likes: 10
  },
  {
    title: 'Test blog 2',
    author: 'Test author 2',
    url: 'http://testblog2.com',
    likes: 20
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json and contain the correct number', async () => {
  const response = await api.get('/api/blogs')
  expect(response.status).toBe(200)
  expect(response.headers['content-type']).toContain('application/json')
  expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
test('unique identifier field is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
  test('blog without title or url is not added', async () => {
    const newBlog = {
      author: 'Test author'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  }) 
  test('a blog can be deleted', async () => {
    const responseAtStart = await api.get('/api/blogs')
    const blogToDelete = responseAtStart.body[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const responseAtEnd = await api.get('/api/blogs')
    expect(responseAtEnd.body).toHaveLength(initialBlogs.length - 1)
  
    const titles = responseAtEnd.body.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })  
  
  test('a blog\'s likes can be updated', async () => {
    const responseAtStart = await api.get('/api/blogs')
    const blogToUpdate = responseAtStart.body[0]
  
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.likes).toBe(blogToUpdate.likes + 1)
  })
  
  test('a blog cannot be added without a token', async () => {
    const newBlog = {
      title: 'Test Blog Without Token',
      author: 'Test Author',
      url: 'http://testurl.com'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  
    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })