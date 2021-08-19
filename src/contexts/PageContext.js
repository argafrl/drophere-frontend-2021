import React from "react";
import { withRouter } from "react-router";
import mainApi from "../api/mainApi";
import { getErrorMessage } from "../helpers";
import { SnackbarContext } from "./SnackbarContext";

export const defaultValue = {
  errorUploadingSubmission: "",
  allPages: [],
  submissionInfo: null,
  userSubmissionDetail: null,
  isUploadingSubmission: false,
  isFetchingAllPages: false,
  isFetchingSubmissionInfo: false,
  isDeletingSubmission: false,
  successUploadSubmission: false,
  uploadProgress: 0,
  uploadSubmission: () => {},
  deleteSubmission: () => {},
  resetState: () => {},
  getAllPages: () => {},
  getSubmissionInfo: () => {},
  resetUploadState: () => {},
};

export const PageContext = React.createContext(defaultValue);

class PageStore extends React.Component {
  state = defaultValue;

  static contextType = SnackbarContext;

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
      this.context.error(getErrorMessage(error));
      this.setState({ successUploadSubmission: false });
    } finally {
      this.setState({ isUploadingSubmission: false });
    }
  };

  getAllPages = async () => {
    try {
      this.setState({ isFetchingAllPages: true });
      const { data } = await mainApi.get("/submissions/");
      this.setState({ allPages: data.data });
    } catch (error) {
      this.context.error(getErrorMessage(error));
    } finally {
      this.setState({ isFetchingAllPages: false });
    }
  };

  getSubmissionInfo = async (slug) => {
    try {
      this.setState({ isFetchingSubmissionInfo: true });
      const { data } = await mainApi.get(`/submissions/${slug}`);
      this.setState({ submissionInfo: data.data });
    } catch (error) {
      this.setState({ error: getErrorMessage(error) });
    } finally {
      this.setState({ isFetchingSubmissionInfo: false });
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
      this.context.success("Halaman Berhasil Dihapus");
      this.getAllPages();
    } catch (error) {
      this.context.error(getErrorMessage(error));
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
      successUploadSubmission: false,
      uploadProgress: 0,
    });
  };

  render() {
    return (
      <PageContext.Provider
        value={{
          ...this.state,
          resetState: this.resetState,
          uploadSubmission: this.uploadSubmission,
          getAllPages: this.getAllPages,
          getSubmissionInfo: this.getSubmissionInfo,
          deleteSubmission: this.deleteSubmission,
          resetUploadState: this.resetUploadState,
        }}
      >
        {this.props.children}
      </PageContext.Provider>
    );
  }
}

export default withRouter(PageStore);
