import { BlogContextProvider } from "./blogContext";
import { LoginContextProvider } from "./loginContext";
import { NotificationContextProvider } from "./notificationContext";
import { UserContextProvider } from "./userContext";
import PropTypes from "prop-types"

const Provider = ({ children }) => (
  <NotificationContextProvider>
    <BlogContextProvider>
      <LoginContextProvider>
        <UserContextProvider>{children}</UserContextProvider>
      </LoginContextProvider>
    </BlogContextProvider>
  </NotificationContextProvider>
);
Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Provider;
