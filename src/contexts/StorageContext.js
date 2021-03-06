import React from "react";
import mainApi from "../api/mainApi";
import { getErrorMessage } from "../utils/functions";
import { SnackbarContext } from "./SnackbarContext";
import { withUser } from "./UserContext";

export const defaultValue = {
  isFetchingOAuthUrl: false,
  isConnectingGoogleDrive: false,
  oAuthUrl: "",
  resetState: () => {},
  getOAuthUrl: () => {},
  connectGoogleDrive: () => {},
};

export const StorageContext = React.createContext(defaultValue);

class StorageStore extends React.Component {
  state = defaultValue;

  static contextType = SnackbarContext;

  getOAuthUrl = async () => {
    try {
      this.setState({ isFetchingOAuthUrl: true });
      const { data } = await mainApi.get("/users/drive_auth", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });
      this.setState({ oAuthUrl: data.data });
    } catch (error) {
      this.context.error(getErrorMessage(error));
    } finally {
      this.setState({ isFetchingOAuthUrl: false });
    }
  };

  connectGoogleDrive = async (data) => {
    try {
      this.setState({ isConnectingGoogleDrive: true });
      await mainApi.post("/users/bind_gdrive", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });
      this.context.success("Akun berhasil ditautkan")
      await this.props.userContext.fetchUserInfo();
    } catch (error) {
      this.context.error("Terjadi Kesalahan");
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

export default withUser(StorageStore);
