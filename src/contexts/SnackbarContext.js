import React from "react";
import { Notyf } from "notyf";

export const SnackbarContext = React.createContext(
  new Notyf({ duration: 3000 })
);

export const withSnackbar = (Comp) => (props) =>
  (
    <SnackbarContext.Consumer>
      {(context) => <Comp {...props} snackbarContext={context} />}
    </SnackbarContext.Consumer>
  );
