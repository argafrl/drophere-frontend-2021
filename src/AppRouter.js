import React, { Component } from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
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
import ScrollToTop from "./ScrollToTop";

class AppRouter extends Component {
  render() {
    function PageSwitch() {
      let location = useLocation();

      return (
        <SidebarStore>
          <Helmet titleTemplate="Drophere • %s" defaultTitle="Drophere">
            <meta
              name="description"
              content="Drophere merupakan sebuah fasilitas untuk mengunggah file yang terintegrasi dengan cloud storage Dropbox dan Google Drive"
            />
            <meta
              name="keywords"
              content="BCC, Basic Computing Community, Application, Drop it to me, dropittome, Fakultas Ilmu Komputer, Universitas Brawijaa, UB, FILKOM"
            />
            <meta name="authors" content="BCC Fakultas Ilmu Komputer UB" />
          </Helmet>
          <UserStore>
            <ScrollToTop />
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
                {/* <Footer /> */}
              </StorageStore>
            </PageStore>
          </UserStore>
        </SidebarStore>
      );
    }

    return (
      <BrowserRouter>
        <PageSwitch />
      </BrowserRouter>
    );
  }
}

export default AppRouter;
