import React, { useContext, useEffect } from "react";
import { Redirect, Route, useLocation } from "react-router";
import { UserContext } from "../contexts/UserContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(UserContext);
  const { state } = useLocation();
  
  if (state && state.from === "/register") {
    return <Redirect to="/connect-account" />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/home" />
      }
    />
  );
};

export default PrivateRoute;
