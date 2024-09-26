const bcrypt = require('bcryptjs')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(2)
})

test('creation fails with too short username or password', async () => {
    const newUser = {
      username: 'ro',
      name: 'Short Username',
      password: 'pw'
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(1)
  })
  