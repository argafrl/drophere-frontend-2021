import React, { useEffect, useMemo } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import mainApi from "../../../api/mainApi";

import style from "../../../css/home.module.scss";

import AuthRoute from "../../../routes/AuthRoute";
import PrivateRoute from "../../../routes/PrivateRoute";

import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import ResetPasswordNew from "./ResetPasswordNew";
import ConnectAccount from "./ConnectAccount";
import NotFound from "../../common/NotFound";
import Contributor from "../../common/Contributor";
import Verify from "../../common/Verify";
import Footer from "../../common/Footer";




const Home = ({ location }) => {
  useMemo(() => {
    mainApi.defaults.headers.common["Authorization"] =
      localStorage.getItem("bccdrophere_token");
  }, []);

  return (
    <div className={style.container}>
      <div className={style.content}>
        {(location.pathname === "/home" ||
          location.pathname === "/register" ||
          location.pathname === "/reset-password") && (
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
            <AuthRoute path="/reset-password" exact component={ResetPasswordNew} />
            <PrivateRoute
              path="/connect-account"
              exact
              component={ConnectAccount}
            />
            <Route path="/contributor" component={Contributor} />
            <Route path="/verify" component={Verify} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Home;
