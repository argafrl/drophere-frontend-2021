import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  error: "",
  resetState: () => {},
  isFetchingOAuthUrl: false,
  getOAuthUrl: () => {},
  isConnectingGoogleDrive: false,
  connectGoogleDrive: () => {},
};

export const StorageContext = React.createContext(defaultValue);

export default class StorageStore extends React.Component {
  state = defaultValue;

  getOAuthUrl = async () => {
    try {
      this.setState({ isFetchingOAuthUrl: true });
      const { data } = await mainApi.get("/users/drive_auth", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });
      return data;
    } catch (error) {
      console.log(error.response);
      this.setState({ error });
      return {};
    } finally {
      this.setState({ isFetchingOAuthUrl: false });
    }
  };

  connectGoogleDrive = async (data) => {
    try {
      this.setState({ isConnectingGoogleDrive: true });
      const res = await mainApi.post("/users/bind_gdrive", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      console.log(error.message);
      console.log(error.response);
      this.setState({ error });
    } finally {
      this.setState({ isConnectingGoogleDrive: false });
    }
  };

  resetState = () => {
    this.setState(defaultValue);
  };

  render() {
    return (
      <StorageContext.Provider
        value={{
          ...this.state,
          getOAuthUrl: this.getOAuthUrl,
          connectGoogleDrive: this.connectGoogleDrive,
          resetState: this.resetState,
        }}
      >
        {this.props.children}
      </StorageContext.Provider>
    );
  }
}
