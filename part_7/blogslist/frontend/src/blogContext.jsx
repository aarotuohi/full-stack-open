
import { useReducer, createContext, useContext } from 'react';
import PropTypes from 'prop-types'; 


const blogReducer = (state, action) => {
  switch (action.type) {
    case 'SETBLOGS':
      return action.payload;
    case 'CREATE':
      return [...state, action.payload];
    default:
      return state;
  }
};


const BlogContext = createContext();


export const BlogContextProvider = ({ children }) => {
  const [blogs, dispatch] = useReducer(blogReducer, []);
  
  return (
    <BlogContext.Provider value={{ blogs, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
};

// PropTypes validation
BlogContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const useBlogValue = () => {
  const { blogs } = useContext(BlogContext);
  return blogs;
};

export const useBlogDispatch = () => {
  const { dispatch } = useContext(BlogContext);
  return dispatch;
};
