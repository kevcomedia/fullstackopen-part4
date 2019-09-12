const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testHelper = require('./test_helper.js')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

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
  const user = new User({
    username: 'kev',
    name: 'Kev',
    passwordHash: 'sample-password-hash',
  })
  const savedUser = await user.save()
  const newBlog = {
    title: 'New blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 42,
    userId: savedUser._id,
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
  const user = new User({
    username: 'kev',
    name: 'Kev',
    passwordHash: 'sample-password-hash',
  })
  const savedUser = await user.save()
  const newBlog = {
    title: 'New blog',
    author: 'John Doe',
    url: 'http://example.com',
    userId: savedUser._id,
  }

  const result = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const createdBlog = result.body
  expect(createdBlog.likes).toBe(0)
})

test('blog title is required', async () => {
  const user = new User({
    username: 'kev',
    name: 'Kev',
    passwordHash: 'sample-password-hash',
  })
  const savedUser = await user.save()
  const blogWithNoTitle = {
    author: 'John Doe',
    url: 'http://example.com',
    userId: savedUser._id,
  }

  await api.post('/api/blogs')
    .send(blogWithNoTitle)
    .expect(400)
})

test('blog url is required', async () => {
  const user = new User({
    username: 'kev',
    name: 'Kev',
    passwordHash: 'sample-password-hash',
  })
  const savedUser = await user.save()
  const blogWithNoUrl = {
    title: 'New blog',
    author: 'John Doe',
    userId: savedUser._id,
  }

  await api.post('/api/blogs')
    .send(blogWithNoUrl)
    .expect(400)
})

test('a blog\'s likes can be updated', async () => {
  const blogToUpdate = testHelper.listWithManyBlogs[0]
  const newBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }

  const result = await api.put(`/api/blogs/${newBlog._id}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const updatedBlog = result.body
  expect(updatedBlog.likes).toBe(newBlog.likes)
})

test('updating a blog with invalid id', async () => {
  const blogToUpdate = testHelper.listWithManyBlogs[0]
  const newBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }

  await api.put('/api/blogs/5f12345678')
    .send(newBlog)
    .expect(400)
})

test('updating a nonexisting blog', async () => {
  await Blog.deleteMany({})

  const blogToUpdate = testHelper.listWithManyBlogs[0]
  const newBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }
  await api.put(`/api/blogs/${blogToUpdate._id}`)
    .send(newBlog)
    .expect(404)
})

test('a blog can be deleted', async () => {
  const blogToDelete = testHelper.listWithManyBlogs[0]
  const id = blogToDelete._id

  await api.delete(`/api/blogs/${id}`)
    .expect(204)

  const blogsAfterDeletion = await api.get('/api/blogs')
  expect(blogsAfterDeletion.body.length).toBe(testHelper.listWithManyBlogs.length - 1)
})

afterAll(() => {
  mongoose.connection.close()
})
