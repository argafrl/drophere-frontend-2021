import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import { SnackbarProvider } from "notistack";

import Home from "./component/panel/Home";
import Account from "./component/panel/Account";
import Drop from "./component/panel/Drop";
import Authorization from "./component/panel/Account/Authorization";
import ResetPassword from "./component/panel/Home/ResetPassword";
class AppRouter extends Component {
  state = { particle: false };

  componentWillMount() {
    axios.defaults.headers.post["Content-Type"] = "application/json";
    const currentToken = localStorage.getItem("bccdrophere_token");
    if (currentToken != null && currentToken.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
    }
  }

  updateParticle = (arg) => {
    if (
      window.location.pathname.search("account") === -1 &&
      arg !== this.state.particle
    )
      // particlesJS.load('particles-js', '/json/particles.json', function () {
      //   console.log('callback - particles.js config loaded');
      // });

      this.setState({ particle: arg });
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            maxSnack={3}
          >
            <Switch>
              <Redirect from="/" to="/home" exact />
              <Redirect from="/login" to="/home" />
              <Route
                path="/home"
                render={(props) => {
                  if (!localStorage.getItem("bccdrophere_token"))
                    return (
                      <Home {...props} updateParticle={this.updateParticle} />
                    );
                  return <Redirect to="/account" />;
                }}
              />
              <Route
                path="/register"
                render={(props) => {
                  if (!localStorage.getItem("bccdrophere_token"))
                    return (
                      <Home {...props} updateParticle={this.updateParticle} />
                    );
                  return <Redirect to="/account" />;
                }}
              />
              <Route
                path="/recover-password"
                render={(props) => {
                  if (!localStorage.getItem("bccdrophere_token"))
                    return (
                      <Home {...props} updateParticle={this.updateParticle} />
                    );
                  return <Redirect to="/account" />;
                }}
              />
              <Route path="/reset-password" component={ResetPassword} />{" "}
              <Route
                path="/connect-account"
                render={(props) => (
                  <Home {...props} updateParticle={this.updateParticle} />
                )}
              />
              <Route
                path="/account/storage/authorize"
                component={Authorization}
              />
              <Route
                path="/account"
                render={(props) => {
                  if (localStorage.getItem("bccdrophere_token"))
                    return (
                      <Account
                        {...props}
                        updateParticle={this.updateParticle}
                      />
                    );
                  return <Redirect to="/home" />;
                }}
              />
              <Route path="/:slug" render={(props) => <Drop {...props} />} />
            </Switch>
          </SnackbarProvider>
        </div>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
