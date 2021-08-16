import React from "react";
import mainApi from "../api/mainApi";
import { getErrorMessage } from "../helpers";
import { SnackbarContext, withSnackbar } from "./SnackbarContext";

export const defaultValue = {
  isPostingFeedback: false,
  postFeedback: () => {},
};

export const SupportContext = React.createContext(defaultValue);

class SupportStore extends React.Component {
  state = defaultValue;
  static contextType = SnackbarContext;

  postFeedback = async (content) => {
    try {
      this.setState({ isPostingFeedback: true });
      await mainApi.post("/users/feedback", { content });
      this.context.success("Feedback Berhasil Dikirim");
    } catch (error) {
      this.context.error(getErrorMessage(error));
    } finally {
      this.setState({ isPostingFeedback: false });
    }
  };

  render() {
    return (
      <SupportContext.Provider
        value={{
          ...this.state,
          postFeedback: this.postFeedback,
        }}
      >
        {this.props.children}
      </SupportContext.Provider>
    );
  }
}

export default withSnackbar(SupportStore);
