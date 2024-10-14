import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => axios.get(baseUrl).then((res) => res.data);

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } };
  return (await axios.post(baseUrl, newBlog, config)).data;
};
const update = async (newBlog, id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${id}`, newBlog, config);
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// Create Comment
const createComment = async (id, content) => {
  const newComment = { comments: content };
  const res = await axios.put(`${baseUrl}/${id}/comments`, newComment);
  return res.data;
};

export default { getAll, setToken, create, update, deleteBlog, createComment };
