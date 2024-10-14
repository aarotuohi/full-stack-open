
import { useReducer, createContext, useContext } from 'react';
import PropTypes from 'prop-types';


const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};


const NotificationContext = createContext();


export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null);

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};


NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const useNotificationValue = () => {
  const { notification } = useContext(NotificationContext);
  return notification;
};

export const useNotificationDispatch = () => {
  const { dispatch } = useContext(NotificationContext);
  return dispatch;
};


export const CreateNotification = (dispatch, message, color, time) => {
  dispatch({ type: 'SET', payload: { message, color } });
  setTimeout(() => {
    dispatch({ type: 'CLEAR' });
  }, time * 1000);
};

export default NotificationContext;
