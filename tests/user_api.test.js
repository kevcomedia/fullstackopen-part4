const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const initialUsers = [
    new User({
      username: 'root',
      name: 'superuser',
      passwordHash: 'not-a-real-hash',
    }),
    new User({
      username: 'kev',
      name: 'Kev',
      passwordHash: 'also-not-a-real-hash',
    }),
  ]
  await Promise.all(initialUsers.map(u => u.save()))
})

describe('user fetch', () => {
  test('retrieves the right number of users', async () => {
    const result = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body.length).toBe(2)
  })

  test('user must have correct fields', async () => {
    const result = await api.get('/api/users')
    const user = result.body[0]
    expect(user.username).toBeDefined()
    expect(user.name).toBeDefined()
    expect(user.id).toBeDefined()
    expect(user.passwordHash).toBeUndefined()
  })
})

describe('user creation', () => {
  test('can create new user', async () => {
    const usersBefore = await User.find({})

    const newUser = {
      username: 'bob',
      name: 'Bob',
      password: 'sample-password',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await User.find({})
    expect(usersAfter.length).toBe(usersBefore.length + 1)
    const usernames = usersAfter.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('doesn\'t create user if username is taken', async () => {
    const usersBefore = await User.find({})

    const newUser = {
      username: 'root',
      name: 'kev',
      password: 'sample-password',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('`username` to be unique')

    const usersAfter = await User.find({})
    expect(usersAfter.length).toBe(usersBefore.length)
  })

  test('username is at least 3 characters long', async () => {
    const usersBefore = await User.find({})

    const newUser = {
      username: 'hi',
      name: 'Hi',
      password: 'sample-password',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const usersAfter = await User.find({})
    expect(usersAfter.length).toBe(usersBefore.length)
  })

  test('password is at least 3 characters long', async () => {
    const usersBefore = await User.find({})

    const newUser = {
      username: 'bob',
      name: 'Bob',
      password: 'hi',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const usersAfter = await User.find({})
    expect(usersAfter.length).toBe(usersBefore.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
