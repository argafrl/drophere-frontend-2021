import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./component/panel/Home";
import Account from "./component/panel/Account";
import Drop from "./component/panel/Drop";
import { UserStore } from "./contexts/UserContext";
import PrivateRoute from "./routes/PrivateRoute";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import SidebarStore from "./contexts/SidebarContext";
import PageStore from "./contexts/PageContext";
import StorageStore from "./contexts/StorageContext";
import "notyf/notyf.min.css";

class AppRouter extends Component {
  render() {
    return (
      <BrowserRouter>
        <SidebarStore>
          <UserStore>
            <Header />
            <PageStore>
              <StorageStore>
                <main>
                  <Switch>
                    <Route path="/link/:slug" exact component={Drop} />
                    <PrivateRoute path="/account" component={Account} />
                    <Route path="/" component={Home} />{" "}
                  </Switch>
                </main>
                <Footer />
              </StorageStore>
            </PageStore>
          </UserStore>
        </SidebarStore>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
