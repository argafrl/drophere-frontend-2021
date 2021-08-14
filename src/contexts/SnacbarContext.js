import React from "react";
import { Notyf } from "notyf";

export const defaultValue = new Notyf({ duration: 3000 });

export const SnackbarContext = React.createContext(defaultValue);

export default class SnackbarStore extends React.Component {
  render() {
    return (
      <SnackbarContext.Provider>{this.props.children}</SnackbarContext.Provider>
    );
  }
}

export const withSidebar = (Comp) => (props) =>
  (
    <SnackbarContext.Consumer>
      {(context) => <Comp {...props} SnackbarContext={context} />}
    </SnackbarContext.Consumer>
  );
