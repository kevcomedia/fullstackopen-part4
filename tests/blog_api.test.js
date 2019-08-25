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

test('can create blog', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 42,
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await api.get('/api/blogs')
  expect(blogsAfterPost.body.length).toBe(testHelper.listWithManyBlogs.length + 1)
  const titles = blogsAfterPost.body.map(blog => blog.title)
  expect(titles).toContain('New blog')
})

test('missing likes property defaults to 0', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'John Doe',
    url: 'http://example.com',
  }

  const result = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const createdBlog = result.body
  expect(createdBlog.likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})
