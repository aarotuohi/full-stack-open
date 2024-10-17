import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const Login = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0]?.message || "Something went wrong");
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      setPage("authors");
      setErrorMessage(null); 
    }
  }, [result.data, setToken, setPage]);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }
    await login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  show: PropTypes.bool,
  setToken: PropTypes.func,
  setPage: PropTypes.func,
};

export default Login;
