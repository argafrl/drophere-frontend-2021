import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  userInfo: null,
  isAuthenticated: !!localStorage.getItem("bccdrophere_token"),
  error: "",
  isLogin: false,
  isRegister: false,
  isFetchingUserInfo: false,
  isSendingEmailVerification: false,
  successSendEmailVerification: false,
  login: () => {},
  register: () => {},
  fetchUserInfo: () => {},
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
      const { data } = await mainApi.get("/users/profile", {
        headers: { Authorization: localStorage.getItem("bccdrophere_token") },
      });
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
      await mainApi.get("/users/verify", {
        headers: { Authorization: localStorage.getItem("bccdrophere_token") },
      });
      this.setState({ successSendEmailVerification: true });
    } catch (error) {
      console.log(error);
      this.logout();
    } finally {
      this.setState({ isSendingEmailVerification: false });
    }
  };

  update = async (profile_image, name, email) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("profile_image", profile_image);
      bodyFormData.append("full_name", name);
      bodyFormData.append("email", email);

      await mainApi.patch("/users/profile", bodyFormData, {
        headers: {
          Authorization: localStorage.getItem("bccdrophere_token"),
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.log(err);
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

      const { data } = await mainApi.post("sign_up", {
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
    this.setState({ error: "" });
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          fetchUserInfo: this.fetchUserInfo,
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
