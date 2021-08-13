import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Home from "./component/panel/Home";
import Account from "./component/panel/Account";
import Drop from "./component/panel/Drop";
import PageNotFound from "./component/panel/Home/PageNotFound";
import { UserStore } from "./contexts/UserContext";
import AuthRoute from "./routes/AuthRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import SidebarStore from "./contexts/SidebarContext";
import PageStore from "./contexts/PageContext";
import StorageStore from "./contexts/StorageContext";

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
          <SidebarStore>
            <UserStore>
              <Header />
              <PageStore>
                <StorageStore>
                  <main>
                    <Switch>
                      <Route path="/link/:slug" exact component={Drop} />
                      <PrivateRoute path="/account" component={Account} />
                      <Route path="/" component={Home} />
                    </Switch>
                  </main>
                  <Footer />
                </StorageStore>
              </PageStore>
            </UserStore>
          </SidebarStore>
        </SnackbarProvider>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
