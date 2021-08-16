import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  userInfo: null,
  isAuthenticated: !!localStorage.getItem("bccdrophere_token"),
  error: "",
  isLogin: false,
  isRegister: false,
  isFetchingUserInfo: false,
  errorSendForgotPassword: "",
  successSendForgotPassword: false,
  isSendingForgotPassword: false,
  isSendingEmailVerification: false,
  successSendEmailVerification: false,
  isUpdating: false,
  login: () => {},
  register: () => {},
  fetchUserInfo: () => {},
  sendForgotPassword: () => {},
  sendEmailVerification: () => {},
  update: () => {},
  logout: () => {},
  clearError: () => {},
};

export const UserContext = React.createContext(defaultValue);

export class UserStore extends React.Component {
  state = defaultValue;

  fetchUserInfo = async () => {
    try {
      this.setState({ isFetchingUserInfo: true });
      const { data } = await mainApi.get("/users/profile");
      this.setState({ userInfo: data.data });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isFetchingUserInfo: false });
    }
  };

  sendEmailVerification = async () => {
    try {
      this.setState({ isSendingEmailVerification: true });
      await mainApi.get("/users/verify");
      this.setState({ successSendEmailVerification: true });
    } catch (error) {
      console.log(error);
      this.logout();
    } finally {
      this.setState({ isSendingEmailVerification: false });
    }
  };

  sendForgotPassword = async (email) => {
    try {
      this.setState({ isSendingForgotPassword: true });

      const { data } = await mainApi.get("/forgot-password", {
        params: {
          email: email,
        },
      });
      this.setState({
        successSendForgotPassword: data.is_success,
        errorSendForgotPassword: "",
      });
    } catch (err) {
      this.setState({
        errorSendForgotPassword: err.message,
        successSendEmailVerification: false,
      });
    } finally {
      this.setState({ isSendingForgotPassword: false });
    }
  };

  resetSendForgotPassword = () => {
    this.setState({
      successSendForgotPassword: false,
    });
  };

  update = async (profileImage, name, email) => {
    try {
      this.setState({ isUpdating: true });

      const bodyFormData = new FormData();
      bodyFormData.append("profile_image", profileImage);
      bodyFormData.append("full_name", name);
      bodyFormData.append("email", email);

      await mainApi.patch("/users/profile", bodyFormData);
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isUpdating: false });
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

  register = async (name, email, password) => {
    try {
      this.setState({ isRegister: true });

      const { data } = await mainApi.post("/sign_up", {
        full_name: name,
        email: email,
        password: password,
      });

      if (data.is_success) {
        this.login(email, password);
      }
    } catch (err) {
      console.log(err.message);
      this.setState({
        error: err.message,
        isAuthenticated: false,
      });
    } finally {
      this.setState({ isRegister: false });
    }
  };

  clearError = () => {
    this.setState({ error: "", errorSendForgotPassword: "" });
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          fetchUserInfo: this.fetchUserInfo,
          sendForgotPassword: this.sendForgotPassword,
          resetSendForgotPassword: this.resetSendForgotPassword,
          sendEmailVerification: this.sendEmailVerification,
          update: this.update,
          login: this.login,
          logout: this.logout,
          register: this.register,
          clearError: this.clearError,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
