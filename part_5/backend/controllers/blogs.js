const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

router.post('/', userExtractor, async (req, res) => {
  const { title, url, likes = 0 } = req.body
  if (!title || !url) return res.status(400).json({ error: 'title or url missing' })
  const blog = new Blog({ ...req.body, likes, user: req.user._id })
  req.user.blogs.push(blog._id)
  await req.user.save()
  res.status(201).json(await blog.save())
})

router.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) return res.status(204).end()
  if (blog.user.toString() !== req.user.id) return res.status(403).json({ error: 'not authorized' })
  await blog.deleteOne()
  req.user.blogs = req.user.blogs.filter(b => b.toString() !== req.params.id)
  await req.user.save()
  res.status(204).end()
})

router.put('/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', { username: 1, name: 1 })
  updatedBlog ? res.json(updatedBlog) : res.status(404).end()
})

module.exports = router
