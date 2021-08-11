import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  isPostingFeedback: false,
  error: "",
  success: false,
  postFeedback: () => {},
  clearError: () => {},
  resetState: () => {},
};

export const SupportContext = React.createContext(defaultValue);

export default class SupportStore extends React.Component {
  state = defaultValue;

  postFeedback = async (content) => {
    try {
      this.setState({ isPostingFeedback: true });
      const res = await mainApi.post("/users/feedback", { content });
      console.log(res);
      this.setState({ success: true });
    } catch (err) {
      this.setState({ success: false });
      this.setState({ error: err.message });
    } finally {
      this.setState({ isPostingFeedback: false });
    }
  };

  clearError = () => {
    this.setState({ error: "" });
  };

  resetState = () => {
    this.setState(defaultValue);
  };

  render() {
    return (
      <SupportContext.Provider
        value={{
          ...this.state,
          postFeedback: this.postFeedback,
          clearError: this.clearError,
          resetState: this.resetState,
        }}
      >
        {this.props.children}
      </SupportContext.Provider>
    );
  }
}