import React, { Component, lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { UserStore } from "./contexts/UserContext";
import PrivateRoute from "./routes/PrivateRoute";
import Header from "./component/common/Header";
import SidebarStore from "./contexts/SidebarContext";
import StorageStore from "./contexts/StorageContext";
import "notyf/notyf.min.css";
import ScrollToTop from "./ScrollToTop";
import withPageView from "./utils/withPageView";
import Preloader from "./component/common/Preloader";

const Home = lazy(() => import("./component/panel/Home"));
const Account = lazy(() => import("./component/panel/Account"));
const Drop = lazy(() => import("./component/panel/Drop"));

class AppRouter extends Component {
  render() {
    return (
      <BrowserRouter>
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
            <StorageStore>
              <main>
                <Switch>
                  <Suspense fallback={<Preloader />}>
                    <Route
                      path="/link/:slug"
                      exact
                      component={withPageView(Drop)}
                    />
                    <PrivateRoute
                      path="/account"
                      component={withPageView(Account)}
                    />
                    <Route path="/" component={withPageView(Home)} />
                  </Suspense>
                </Switch>
              </main>
            </StorageStore>
          </UserStore>
        </SidebarStore>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
