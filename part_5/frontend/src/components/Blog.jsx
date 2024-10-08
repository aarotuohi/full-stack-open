import { useState } from 'react'

const Blog = ({ blog, username, updateLikes, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user 
    }
    updateLikes(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)  
    }
  }

  return (
    <div className="blog">
      <div>
        <span>{blog.title} </span>
        <span>{blog.author} </span>
        <button onClick={toggleDetails}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>

      {detailsVisible && (
        <div>
          <a href={blog.url}>{blog.url}</a>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <span>{blog.user.name}</span>
          {blog.user.username === username && (
            <div>
              <button onClick={handleDelete}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog

