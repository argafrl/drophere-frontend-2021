import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  userInfo: null,
  isAuthenticated: !!localStorage.getItem("bccdrophere_token"),
  fetchUserInfo: () => {},
  isFetchingUserInfo: false,
  error: "",
  login: () => {},
  isLogin: false,
  logout: () => {},
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
      this.logout();
    } finally {
      this.setState({ isFetchingUserInfo: false });
    }
  };

  login = async (email, password) => {
    try {
      this.setState({ isLogin: true });
      const { data } = await mainApi.post("/sign_in", { email, password });

      const token = data.data.replace("Bearer ", "");

      localStorage.setItem("bccdrophere_token", token);

      this.setState({ isAuthenticated: true });
    } catch (err) {
      this.setState({
        error: err.message,
        isAuthenticated: false,
      });
    } finally {
      this.setState({ isLogin: false });
    }
  };

  // handleLogin= async(email, password) =>{
  //   e.preventDefault()
  //     await genose.post("/user/login",{
  //         email:email,
  //         password:password
  //   }).then((res) => {
  //         res.status === 200 && setAuthTokens(res.data.data.jwtoken)
  //         setLoggedIn(true)
  //         console.log(res);
  //   }).catch(err => {
  //         console.log(err);
  //   })
  //   }

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
