import React from "react";
import mainApi from "../api/mainApi";

export const defaultValue = {
  successCreatingSubmission: false,
  isCreatingSubmission: false,
  error: "",
  createSubmission: () => {},
  resetState: () => {},
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
      this.setState({ isCreatingSubmission: false });
    } finally {
      this.setState({ isCreatingSubmission: false });
    }
  };

  resetState = () => {
    this.setState(defaultValue);
  };

  render() {
    return (
      <PageContext.Provider
        value={{
          ...this.state,
          createSubmission: this.createSubmission,
          resetState: this.resetState,
        }}
      >
        {this.props.children}
      </PageContext.Provider>
    );
  }
}
