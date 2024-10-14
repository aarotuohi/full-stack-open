
import { useReducer, createContext, useContext } from 'react';
import PropTypes from 'prop-types';


const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SETUSERNAME':
      return { ...state, username: action.payload };
    case 'SETPASSWORD':
      return { ...state, password: action.payload };
    default:
      return state;
  }
};


const LoginContext = createContext();


export const LoginContextProvider = ({ children }) => {
  const [login, dispatch] = useReducer(loginReducer, { username: '', password: '' });

  return (
    <LoginContext.Provider value={{ login, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
};


LoginContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const useLoginValue = () => {
  const { login } = useContext(LoginContext);
  return login;
};

export const useLoginDispatch = () => {
  const { dispatch } = useContext(LoginContext);
  return dispatch;
};


export const changeUsername = (dispatch, username) => {
  dispatch({ type: 'SETUSERNAME', payload: username });
};


export const changePassword = (dispatch, password) => {
  dispatch({ type: 'SETPASSWORD', payload: password });
};
