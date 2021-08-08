import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Home from "./component/panel/Home";
import Account from "./component/panel/Account";
import Drop from "./component/panel/Drop";
import { UserStore } from "./contexts/UserContext";
import AuthRoute from "./routes/AuthRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";

class AppRouter extends Component {
  state = { particle: false };

  render() {
    return (
      <BrowserRouter>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          maxSnack={3}
        >
          <UserStore>
            <Header />
            <main>
              <Switch>
                <Route path="/link/:slug" exact component={Drop} />
                <PrivateRoute path="/account" component={Account} />
                <AuthRoute path="/" component={Home} />
              </Switch>
            </main>
            <Footer />
          </UserStore>
        </SnackbarProvider>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
