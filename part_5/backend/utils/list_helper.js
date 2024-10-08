const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }
  
 
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
  
    return blogs.reduce((favorite, blog) => {
      return blog.likes > favorite.likes ? blog : favorite
    }, blogs[0])
  }
  const mostBlogs = (blogs) => {
    const authors = _.countBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(Object.keys(authors), (author) => authors[author])
  
    return {
      author: authorWithMostBlogs,
      blogs: authors[authorWithMostBlogs]
    }
  }
  const mostLikes = (blogs) => {
    const likesByAuthor = _(blogs)
      .groupBy('author')
      .map((blogs, author) => ({
        author: author,
        likes: _.sumBy(blogs, 'likes')
      }))
      .maxBy('likes')
  
    return likesByAuthor || null
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  