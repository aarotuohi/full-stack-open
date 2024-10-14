import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useUserDispatch, useUserValue, initializeUser } from "./userContext";
import { useBlogDispatch, useBlogValue } from "./blogContext";
import { useLoginValue } from "./loginContext";
import { CreateNotification, useNotificationDispatch } from "./notificationContext";

const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const login = useLoginValue();
  const notifyDispatch = useNotificationDispatch();
  const blogs = useBlogValue();
  const blogsDispatch = useBlogDispatch();
  const blogFormRef = useRef();

  useEffect(() => {
    initializeUser(userDispatch);
    blogService.getAll().then(blogs => blogsDispatch({ type: "SETBLOGS", payload: blogs }));
  }, [blogsDispatch, userDispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await loginService.login({ ...login });
      window.localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      userDispatch({ type: 'SET', payload: loggedUser });
      blogService.setToken(loggedUser.token);
    } catch {
      CreateNotification(notifyDispatch, "Wrong Credentials!", "red", 3);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    userDispatch({ type: "CLEAR" });
  };

  const createNewBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog);
    blogsDispatch({ type: "CREATE", payload: createdBlog });
    blogFormRef.current.toggleVisibility();
    CreateNotification(notifyDispatch, `A new blog '${newBlog.title}' was added!`, "green", 3);
  };
  
  const addLikes = async (newBlog, id) => {
    await blogService.update(newBlog, id);
    blogsDispatch({type: "UPDATE", payload: newBlog});
  };
  
  const removeBlog = async (id) => {
    try {
      await blogService.deleteBlog(id);
      blogsDispatch({type: "DELETE", payload: id});
      CreateNotification(notifyDispatch, "Blog deleted successfully!", "green", 3);
    } catch (error) {
      CreateNotification(notifyDispatch, `Failed to delete the blog: ${error.response.data.error}`, "red", 3);
    }
  };

  if (!user) return <Login handleLogin={handleLogin} />;

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>{user.name} <button onClick={handleLogout}>Logout</button></p>
      <Togglable buttonLabelShow="Create new" ref={blogFormRef}>
        <BlogForm createNewBlog={createNewBlog} />
      </Togglable>
      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          addLike={addLikes}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  );
};

export default App;
