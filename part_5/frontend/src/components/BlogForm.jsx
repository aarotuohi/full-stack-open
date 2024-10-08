import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create new blog</h2>
      <input placeholder="Title" value={title} onChange={({ target }) => setTitle(target.value)} />
      <input placeholder="Author" value={author} onChange={({ target }) => setAuthor(target.value)} />
      <input placeholder="URL" value={url} onChange={({ target }) => setUrl(target.value)} />
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
