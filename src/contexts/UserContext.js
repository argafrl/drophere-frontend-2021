import React from "react";
import mainApi from "../api/mainApi";
import { getErrorMessage } from "../helpers";
import { SnackbarContext } from "./SnackbarContext";

export const defaultValue = {
  userInfo: null,
  isAuthenticated: !!localStorage.getItem("bccdrophere_token"),
  error: "",
  isLogin: false,
  isFetchingUserInfo: false,
  isSendingEmailVerification: false,
  successSendEmailVerification: false,
  login: () => {},
  fetchUserInfo: () => {},
  sendEmailVerification: () => {},
  logout: () => {},
  clearError: () => {},
};

export const UserContext = React.createContext(defaultValue);

export class UserStore extends React.Component {
  state = defaultValue;
  static contextType = SnackbarContext;

  fetchUserInfo = async () => {
    try {
      this.setState({ isFetchingUserInfo: true });
      const { data: resProfile } = await mainApi.get("/users/profile");
      const { data: resDriveStatus } = await mainApi.get(
        "/users/profile/gdrive_connected"
      );
      this.setState({
        userInfo: { ...resProfile.data, ...resDriveStatus.data },
      });
    } catch (error) {
      this.context.error(getErrorMessage(error));
      console.log(getErrorMessage(error));
      this.logout();
    } finally {
      this.setState({ isFetchingUserInfo: false });
    }
  };

  clearUserInfo = () => {
    this.setState({
      userInfo: null,
    });
  };

  sendEmailVerification = async () => {
    try {
      this.setState({ isSendingEmailVerification: true });
      await mainApi.get("/users/verify");
      this.setState({ successSendEmailVerification: true });
    } catch (error) {
      this.context.error("Terjadi Kesalahan");
    } finally {
      this.setState({ isSendingEmailVerification: false });
    }
  };

  login = async (email, password) => {
    try {
      this.setState({ isLogin: true });

      const { data } = await mainApi.post("/sign_in", { email, password });
      const token = data.data.replace("Bearer ", "");
      localStorage.setItem("bccdrophere_token", token);

      mainApi.defaults.headers.common["Authorization"] =
        localStorage.getItem("bccdrophere_token");
      this.setState({ isAuthenticated: true, error: "" });
    } catch (err) {
      this.setState({
        error: err.response.data.message,
        isAuthenticated: false,
      });
    } finally {
      this.setState({ isLogin: false });
    }
  };

  logout = () => {
    this.setState({
      isAuthenticated: false,
      userInfo: null,
    });
    localStorage.removeItem("bccdrophere_token");
  };

  clearError = () => {
    this.setState({
      error: "",
    });
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          fetchUserInfo: this.fetchUserInfo,
          clearUserInfo: this.clearUserInfo,
          sendEmailVerification: this.sendEmailVerification,
          login: this.login,
          logout: this.logout,
          clearError: this.clearError,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export const withUser = (Comp) => (props) => {
  return (
    <UserContext.Consumer>
      {(context) => <Comp {...props} userContext={context} />}
    </UserContext.Consumer>
  );
};
