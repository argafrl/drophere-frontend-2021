import axios from "axios";
import React from "react";
import { endpointURL } from "../config";

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
      const { data } = await axios.post(
        endpointURL,
        {
          query: `
              query {
                me {
                  email
                  name
                }
              }`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "bccdrophere_token"
            )}`,
          },
        }
      );
      this.setState({ userInfo: data.data.me });
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
      const resp = await axios.post(endpointURL, {
        query: `
      mutation login($email:String!,$password:String!){
        login(email:$email, password:$password){
          loginToken
        }
      }
      `,
        variables: {
          email,
          password,
        },
        operationName: "login",
      });
      const loginResp = resp.data.data.login;
      if (loginResp) {
        localStorage.setItem("bccdrophere_token", loginResp.loginToken);
        this.setState({ isAuthenticated: true });
        return;
      }
      throw new Error(resp.data.errors[0].message);
    } catch (err) {
      this.setState({
        error: err.message,
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
