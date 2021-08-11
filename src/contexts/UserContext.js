import React from "react";
import mainApi from "../api/mainApi";
import Authorization from "../component/panel/Account/Authorization";

export const defaultValue = {
  userInfo: null,

  isAuthenticated: !!localStorage.getItem("bccdrophere_token"),
  fetchUserInfo: () => {},
  isFetchingUserInfo: false,
  error: "",
  login: () => {},
  isLogin: false,
  update: () => {},
  logout: () => {},
};

export const UserContext = React.createContext(defaultValue);

export class UserStore extends React.Component {
  state = defaultValue;

  fetchUserInfo = async () => {
    try {
      this.setState({ isFetchingUserInfo: true });
      const { data } = await mainApi.get("/users/profile",{
        headers: {Authorization: localStorage.getItem("bccdrophere_token")}
      });
      this.setState({ userInfo: data.data });
      // console.log(data.data);
    } catch (error) {
      console.log(error);
      // this.logout();
    } finally {
      this.setState({ isFetchingUserInfo: false });
    }
  };

  update = async(profile_image, name, email) => {
    try{
      const bodyFormData = new FormData();
      bodyFormData.append("profile_image", profile_image);
      bodyFormData.append("full_name", name);
      bodyFormData.append("email", email);
      
      await mainApi.patch("/users/profile", bodyFormData, {
        headers: {
          "Authorization": localStorage.getItem("bccdrophere_token"),
          "Content-Type": "multipart/form-data"
        },
        // data: bodyFormData,
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

      // console.log(token);

      this.setState({ isAuthenticated: true, error: "" });
    } catch (err) {
      // console.log(err.response.data.message);
      this.setState({
        error: err.response.data.message,
        isAuthenticated: false,
      });
    } finally {
      this.setState({ isLogin: false });
    }
  };

  logout = () => {
    this.setState({ isAuthenticated: false });
    localStorage.removeItem("bccdrophere_token");
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          fetchUserInfo: this.fetchUserInfo,
          login: this.login,
          logout: this.logout,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
