import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import { UserContext } from "../contexts/UserContext";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Redirect to="/account" /> : <Component {...props} />
      }
    />
  );
};

export default AuthRoute;
