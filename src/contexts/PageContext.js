import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  createSubmission: () => {},
  error: "",
  allPages: [],
  isCreatingSubmission: false,
  isUploadingSubmission: false,
  isFetchingAllPages: false,
  successCreatingSubmission: false,
  successUploadSubmission: false,
  successFetchAllPages: false,
  uploadProgress: 0,
  uploadSubmission: () => {},
  resetState: () => {},
  clearError: () => {},
  clearCreateSubmissionSuccess: () => {},
  getAllPages: () => {},
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
      console.log(error.response);
      console.log(error.message);
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
      await mainApi.post("/submissions/heroku/upload", formData, {
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

  getAllPages = async () => {
    try {
      this.setState({ isFetchingAllPages: true });
      const { data } = await mainApi.get("/submissions/");
      console.log(data);
      this.setState({ allPages: data.data });
      this.setState({ successFetchAllPages: true });
    } catch (error) {
      this.setState({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      this.setState({ successFetchAllPages: false });
    } finally {
      this.setState({ isFetchingAllPages: false });
    }
  };

  resetState = () => {
    this.setState({
      error: "",
      isCreatingSubmission: false,
      isUploadingSubmission: false,
      successCreatingSubmission: false,
      successUploadSubmission: false,
      uploadProgress: 0,
    });
  };

  clearError = () => {
    this.setState({ error: "" });
  };

  clearCreateSubmissionSuccess = () => {
    this.setState({ successCreatingSubmission: false });
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
          getAllPages: this.getAllPages,
          clearCreateSubmissionSuccess: this.clearCreateSubmissionSuccess,
        }}
      >
        {this.props.children}
      </PageContext.Provider>
    );
  }
}
