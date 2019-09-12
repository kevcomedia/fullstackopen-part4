const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (exception) {
    next(exception)
  }
})

userRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'password required' })
  }
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const user = new User({
      username,
      name,
      passwordHash,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = userRouter
