import React from "react";
import mainApi from "../api/mainApi";
import { getErrorMessage } from "../helpers";
import { SnackbarContext } from "./SnackbarContext";

export const defaultValue = {
  userInfo: null,
  isAuthenticated: !!localStorage.getItem("bccdrophere_token"),
  error: "",
  isLogin: false,
  isRegister: false,
  isFetchingUserInfo: false,
  isSendingEmailVerification: false,
  successSendEmailVerification: false,
  isUpdating: false,
  successUpdating: false,
  errorUpdating: "",
  login: () => {},
  register: () => {},
  fetchUserInfo: () => {},
  sendEmailVerification: () => {},
  updateName: () => {},
  updatePassword: () => {},
  updateProfileImage: () => {},
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
      console.log(error);
      this.logout();
    } finally {
      this.setState({ isSendingEmailVerification: false });
    }
  };

  updateName = async (name) => {
    try {
      this.setState({ isUpdating: true });

      const { data } = await mainApi.patch("/users/profile", {
        full_name: name
      });
      this.setState({
        successUpdating: data.is_success,
        errorUpdating: "",
      });
    } catch (err) {
      this.setState({
        successUpdating: false,
        errorUpdating: err.message,
      });
    } finally {
      this.setState({ isUpdating: false, successUpdating: false });
    }
  };

  updatePassword = async (currentPassword, retypePassword) => {
    try {
      this.setState({ isUpdating: true });

      const { data } = await mainApi.patch("/users/profile/password", {
        old_password: currentPassword,
        new_password: retypePassword,
      });
      console.log(data)
      this.setState({
        successUpdating: data.is_success,
        errorUpdating: "",
      });
    } catch (err) {
      this.setState({
        successUpdating: false,
        errorUpdating: err.message,
      });
    } finally {
      this.setState({ isUpdating: false, successUpdating: false });
    }
  };

  updateProfileImage = async (profileImage) => {
    try {
      this.setState({ isUpdating: true });

      const bodyFormData = new FormData();
      bodyFormData.append("profile_image", profileImage);

      const { data } = await mainApi.patch("/users/profile/image", bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      this.setState({
        successUpdating: data.is_success,
        errorUpdating: "",
      });
    } catch (err) {
      this.setState({
        successUpdating: false,
        errorUpdating: err.message,
      });
    } finally {
      this.setState({ isUpdating: false, successUpdating: false });
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
      console.log(err.response.data.message);
      this.setState({
        error: err.response.data.message,
        isAuthenticated: false,
      });
    } finally {
      this.setState({ isRegister: false });
    }
  };

  clearError = () => {
    this.setState({
      error: "",
      errorUpdating: "",
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
          updateName: this.updateName,
          updatePassword: this.updatePassword,
          updateProfileImage: this.updateProfileImage,
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

export const withUser = (Comp) => (props) => {
  return (
    <UserContext.Consumer>
      {(context) => <Comp {...props} userContext={context} />}
    </UserContext.Consumer>
  );
};
