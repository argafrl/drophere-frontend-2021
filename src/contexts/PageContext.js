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
  isCreatingSubmission: false,
  isUploadingSubmission: false,
  isFetchingAllPages: false,
  isFetchingSubmissionInfo: false,
  isFetchingUserSubmissionDetail: false,
  isUpdatingSubmission: false,
  isDeletingSubmission: false,
  successUploadSubmission: false,
  successFetchAllPages: false,
  uploadProgress: 0,
  createSubmission: () => {},
  uploadSubmission: () => {},
  updateSubmission: () => {},
  deleteSubmission: () => {},
  resetState: () => {},
  getAllPages: () => {},
  getSubmissionInfo: () => {},
  getUserSubmissionDetail: () => {},
  resetUploadState: () => {},
};

export const PageContext = React.createContext(defaultValue);

class PageStore extends React.Component {
  state = defaultValue;

  static contextType = SnackbarContext;

  createSubmission = async (data) => {
    try {
      this.setState({ isCreatingSubmission: true });

      await mainApi.post("/submissions/", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });

      this.context.success("Halaman Berhasil Dibuat");
      this.props.history.push("/account/pages");
    } catch (error) {
      if (
        getErrorMessage(error) ===
        'supabase error: duplicate key value violates unique constraint "submissions_slug_key"'
      ) {
        this.context.error("Link Telah Digunakan");
      } else {
        this.context.error(getErrorMessage(error));
      }
    } finally {
      this.setState({ isCreatingSubmission: false });
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

      this.context.success("Halaman Berhasil Diperbarui");
      this.getUserSubmissionDetail(slug);
    } catch (error) {
      if (getErrorMessage(error) === "entry not found") {
        this.props.history.push("/not-found");
      } else {
        this.context.error(getErrorMessage(error));
      }
    } finally {
      this.setState({ isUpdatingSubmission: false });
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

  getUserSubmissionDetail = async (slug) => {
    try {
      this.setState({ isFetchingUserSubmissionDetail: true });
      const { data } = await mainApi.get(`/submissions/${slug}/details`);
      this.setState({ userSubmissionDetail: data.data });
    } catch (error) {
      if (getErrorMessage(error) === "entry not found") {
        this.props.history.push("/not-found");
      } else {
        this.context.error(getErrorMessage(error));
      }
    } finally {
      this.setState({ isFetchingUserSubmissionDetail: false });
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
      successCreatingSubmission: false,
      successUploadSubmission: false,
      successUpdateSubmission: false,
      successFetchAllPages: false,
      uploadProgress: 0,
    });
  };

  render() {
    return (
      <PageContext.Provider
        value={{
          ...this.state,
          createSubmission: this.createSubmission,
          resetState: this.resetState,
          uploadSubmission: this.uploadSubmission,
          getAllPages: this.getAllPages,
          getSubmissionInfo: this.getSubmissionInfo,
          getUserSubmissionDetail: this.getUserSubmissionDetail,
          updateSubmission: this.updateSubmission,
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
