import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import style from "../../../css/home.module.scss";

import Header from "./Header";
import Login from "./Login";

import Register from "./Register";
import ConnectAccount from "./ConnectAccount";
import PrivateRoute from "../../../routes/PrivateRoute";
import AuthRoute from "../../../routes/AuthRoute";

const Home = ({ location }) => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        {location.pathname !== "/connect-account" && (
          <div className={style.header + " left-to-right-anim"}>
            <Header />
          </div>
        )}
        <div className={style.auth + " right-to-left-anim"}>
          <Switch>
            <Redirect from="/" to="/home" exact />
            <Redirect from="/login" to="/home" />
            <AuthRoute path="/home" exact component={Login} />
            <AuthRoute path="/register" exact component={Register} />
            <PrivateRoute
              path="/connect-account"
              exact
              component={ConnectAccount}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Home;
