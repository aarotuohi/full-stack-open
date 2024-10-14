import { useState } from "react";
import PropTypes from "prop-types";
import { useUserValue } from "../userContext";
import blogService from '../services/blogs';

const Blog = ({ blog, addLike, removeBlog }) => {
  const [visible, setVisible] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("show");
  const [comments, setComments] = useState(blog.comments || []); // Initialize comments
  const [newComment, setNewComment] = useState(""); // To handle new comment input

  const user = useUserValue(); // Fetch the current logged-in user

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showVisible = { display: visible ? "" : "none" };

  // Check if the logged-in user is the same as the user who created the blog post
  const isSameUser = blog.user.id === user.id || blog.user === user.id;

  const clickShow = () => {
    setVisible(!visible);
    setButtonLabel(visible ? "show" : "hide");
  };

  const updateLikes = async () => {
    const blogUpdate = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    };
    addLike(blogUpdate, blog.id);
  };

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
      removeBlog(blog.id); 
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

   
    const updatedComments = [...comments, newComment];
    setComments(updatedComments); 

    try {
      await blogService.createComment(blog.id, newComment);
    } catch (error) {
      console.error("Failed to post comment", error);
    }

    setNewComment(""); 
  };

  return (
    <div style={blogStyle} data-testid="blog card">
      <div className="blog_header">
        {blog.title} {blog.author}
        <button onClick={clickShow}>{buttonLabel}</button>
      </div>
      <div style={showVisible} className="blog_show">
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={updateLikes}>like</button>
        </div>
        <div>{blog.user && blog.user.name}</div>
        
        {/* Only show the Delete button if the logged-in user is the creator of the blog */}
        {isSameUser && <button onClick={deleteBlog}>Delete</button>}

        {/* Comment Section */}
        <div>
          <h4>Comments</h4>
          <ul>
            {comments.map((comment, idx) => (
              <li key={idx}>{comment}</li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func,
  removeBlog: PropTypes.func,
};

export default Blog;
