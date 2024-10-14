import axios from "axios";
const baseUrl = "/api/login";

const login = async (credentials) => {
  return (await axios.post(baseUrl, credentials)).data;
};

export default { login };
