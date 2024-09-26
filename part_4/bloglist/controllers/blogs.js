const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
  
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title or url missing' })
    }
  
    const user = await User.findOne() 
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
      })
  
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  })
  blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
  
    try {
      await Blog.findByIdAndRemove(id)
      response.status(204).end()
    } catch (error) {
      response.status(400).json({ error: 'invalid id' })
    }
  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const updatedBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    try {
      const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
      response.json(result)
    } catch (error) {
      response.status(400).json({ error: 'invalid id' })
    }
  })

module.exports = blogsRouter
