const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const testHelper = require('./test_helper.js')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogPromises = testHelper.listWithManyBlogs
    .map((blog) => new Blog(blog))
    .map((blog) => blog.save())
  await Promise.all(blogPromises)
})

test('retrieves the right number of blogs', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs are identified by id', async () => {
  const result = await api.get('/api/blogs').expect(200)
  result.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
