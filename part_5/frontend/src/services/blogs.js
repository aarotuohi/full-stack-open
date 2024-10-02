import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => (await axios.get(baseUrl)).data

const create = async (newObject) => {
  const config = { headers: { Authorization: token } }
  return (await axios.post(baseUrl, newObject, config)).data
}

const update = async (id, newObject) => (await axios.put(`${baseUrl}/${id}`, newObject)).data

const deleteBlog = async (id) => {
  const config = { headers: { Authorization: token } }
  return (await axios.delete(`${baseUrl}/${id}`, config)).data
}

export default { setToken, getAll, create, update, deleteBlog }
