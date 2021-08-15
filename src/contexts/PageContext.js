import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  error: "",
  allPages: [],
  submissionInfo: null,
  userSubmissionDetail: null,
  isCreatingSubmission: false,
  isUploadingSubmission: false,
  isFetchingAllPages: false,
  isFetchingSubmissionInfo: false,
  isFetchingUserSubmissionDetail: false,
  isUpdatingSubmission: false,
  isDeletingSubmission: false,
  successCreatingSubmission: false,
  successUploadSubmission: false,
  successUpdateSubmission: false,
  successDeleteSubmission: false,
  successFetchAllPages: false,
  uploadProgress: 0,
  createSubmission: () => {},
  uploadSubmission: () => {},
  updateSubmission: () => {},
  deleteSubmission: () => {},
  resetState: () => {},
  clearError: () => {},
  getAllPages: () => {},
  getSubmissionInfo: () => {},
  getUserSubmissionDetail: () => {},
  clearCreateSubmissionSuccess: () => {},
  clearDeleteSubmissionSuccess: () => {},
  resetUploadState: () => {},
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

  uploadSubmission = async (formData, slug) => {
    try {
      this.setState({ isUploadingSubmission: true });
      await mainApi.post(`/submissions/${slug}/upload`, formData, {
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

  getSubmissionInfo = async (slug) => {
    try {
      this.setState({ isFetchingSubmissionInfo: true });
      const { data } = await mainApi.get(`/submissions/${slug}`);
      this.setState({ submissionInfo: data.data });
    } catch (error) {
      this.setState({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    } finally {
      this.setState({ isFetchingSubmissionInfo: false });
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

  getUserSubmissionDetail = async (slug) => {
    try {
      this.setState({ isFetchingUserSubmissionDetail: true });
      const { data } = await mainApi.get(`/submissions/${slug}/details`);
      console.log(data);
      this.setState({ userSubmissionDetail: data.data });
    } catch (error) {
      this.setState({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    } finally {
      this.setState({ isFetchingUserSubmissionDetail: false });
    }
  };

  updateSubmission = async (slug, data) => {
    try {
      this.setState({ isUpdatingSubmission: true });

      await mainApi.patch(`/submissions/${slug}/edit`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });

      this.setState({ successUpdateSubmission: true });
    } catch (error) {
      this.setState({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      this.setState({ successUpdateSubmission: false });
    } finally {
      this.setState({ isUpdatingSubmission: false });
    }
  };

  deleteSubmission = async (slug) => {
    try {
      this.setState({ isDeletingSubmission: true });

      await mainApi.delete(`/submissions/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });

      this.setState({ successDeleteSubmission: true });
    } catch (error) {
      this.setState({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      this.setState({ successDeleteSubmission: false });
    } finally {
      this.setState({ isDeletingSubmission: false });
    }
  };

  resetUploadState = () => {
    this.setState({
      error: "",
      isUploadingSubmission: false,
      successUploadSubmission: false,
      uploadProgress: 0,
    });
  };

  resetState = () => {
    this.setState({
      error: "",
      allPages: [],
      submissionInfo: null,
      userSubmissionDetail: null,
      isCreatingSubmission: false,
      isUploadingSubmission: false,
      isFetchingAllPages: false,
      isFetchingSubmissionInfo: false,
      isFetchingUserSubmissionDetail: false,
      isUpdatingSubmission: false,
      successCreatingSubmission: false,
      successUploadSubmission: false,
      successUpdateSubmission: false,
      successFetchAllPages: false,
      uploadProgress: 0,
    });
  };

  clearError = () => {
    this.setState({ error: "" });
  };

  clearCreateSubmissionSuccess = () => {
    this.setState({ successCreatingSubmission: false });
  };

  clearDeleteSubmissionSuccess = () => {
    this.setState({ successDeleteSubmission: false });
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
          getSubmissionInfo: this.getSubmissionInfo,
          getUserSubmissionDetail: this.getUserSubmissionDetail,
          updateSubmission: this.updateSubmission,
          deleteSubmission: this.deleteSubmission,
          clearDeleteSubmissionSuccess: this.clearDeleteSubmissionSuccess,
          resetUploadState: this.resetUploadState,
        }}
      >
        {this.props.children}
      </PageContext.Provider>
    );
  }
}
