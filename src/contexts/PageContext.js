import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  createSubmission: () => {},
  isCreatingSubmission: false,
  successCreatingSubmission: false,
  uploadSubmission: () => {},
  isUploadingSubmission: false,
  successUploadSubmission: false,
  uploadProgress: 0,
  error: "",
  resetState: () => {},
  clearError: () => {},
};

export const PageContext = React.createContext(defaultValue);

export default class PageStore extends React.Component {
  state = defaultValue;

  createSubmission = async (data) => {
    try {
      this.setState({ isCreatingSubmission: true });

      await mainApi.post("/submissions/", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });

      this.setState({ successCreatingSubmission: true });
    } catch (error) {
      this.setState({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      this.setState({ successCreatingSubmission: false });
    } finally {
      this.setState({ isCreatingSubmission: false });
    }
  };

  uploadSubmission = async (formData) => {
    try {
      this.setState({ isUploadingSubmission: true });

      const res = await mainApi.post("/submissions/heroku/upload", formData, {
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          this.setState({
            uploadProgress: percentCompleted,
          });
        },
      });
      this.setState({ successUploadSubmission: true });
    } catch (error) {
      this.setState({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      this.setState({ successUploadSubmission: false });
    } finally {
      this.setState({ isUploadingSubmission: false });
    }
  };

  resetState = () => {
    this.setState(defaultValue);
  };

  clearError = () => {
    this.setState({ error: "" });
  };

  render() {
    return (
      <PageContext.Provider
        value={{
          ...this.state,
          createSubmission: this.createSubmission,
          resetState: this.resetState,
          uploadSubmission: this.uploadSubmission,
          clearError: this.clearError,
        }}
      >
        {this.props.children}
      </PageContext.Provider>
    );
  }
}
