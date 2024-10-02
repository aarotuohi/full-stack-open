const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), {})

const mostBlogs = (blogs) => {
  if (!blogs.length) return null
  const authorCounts = blogs.reduce((acc, { author }) => ({ ...acc, [author]: (acc[author] || 0) + 1 }), {})
  const maxAuthor = Object.keys(authorCounts).reduce((max, author) => (authorCounts[author] > authorCounts[max] ? author : max))
  return { author: maxAuthor, blogs: authorCounts[maxAuthor] }
}

const mostLikes = (blogs) => {
  if (!blogs.length) return null
  const authorLikes = blogs.reduce((acc, { author, likes }) => ({ ...acc, [author]: (acc[author] || 0) + likes }), {})
  const maxAuthor = Object.keys(authorLikes).reduce((max, author) => (authorLikes[author] > authorLikes[max] ? author : max))
  return { author: maxAuthor, likes: authorLikes[maxAuthor] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
