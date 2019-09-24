const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

blogRouter.post('/', tokenExtractor, async (request, response, next) => {
  try {
    const { body, token } = request

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
    })
    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
  } catch (exception) {
    next(exception)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true },
    )
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

blogRouter.delete('/:id', tokenExtractor, async (request, response, next) => {
  try {
    const { token } = request

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blogToDelete = await Blog.findById(request.params.id)
    if (blogToDelete.user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: 'cannot delete other\'s blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogRouter
