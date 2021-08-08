import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import { UserContext } from "../contexts/UserContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(UserContext);

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
