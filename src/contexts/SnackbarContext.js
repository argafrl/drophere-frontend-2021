import React from "react";
import { Notyf } from "notyf";

export const SnackbarContext = React.createContext(
  new Notyf({ duration: 3000 })
);
