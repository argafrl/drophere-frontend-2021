import React, { useContext } from "react";
import { Redirect, Route, useLocation } from "react-router";
import { UserContext } from "../contexts/UserContext";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(UserContext);
  const { pathname } = useLocation();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to={{ pathname: "/account", state: { from: pathname } }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default AuthRoute;
