import PropTypes from 'prop-types';
import { useLoginDispatch, useLoginValue, changePassword, changeUsername } from '../loginContext';

const Login = ({ handleLogin }) => {
  const login = useLoginValue();
  const dispatch = useLoginDispatch();

  return (
    <form onSubmit={handleLogin}>
      <input
        value={login.username}
        placeholder="username"
        onChange={(e) => changeUsername(dispatch, e.target.value)}
      />
      <input
        type="password"
        value={login.password}
        placeholder="password"
        onChange={(e) => changePassword(dispatch, e.target.value)}
      />
      <button type="submit">login</button>
    </form>
  );
};

// Add PropTypes validation for the handleLogin prop
Login.propTypes = {
  handleLogin: PropTypes.func.isRequired, // Ensure handleLogin is required and is a function
};

export default Login;
