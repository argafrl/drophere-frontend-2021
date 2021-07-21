import React from "react";
import { Route, Switch } from 'react-router-dom';

import style from '../../../css/home.module.scss';

import Header from './Header';
import LogoHeader from '../../common/Header';
import Login from './Login';
import RecoverPassword from "./RecoverPassword";
import Register from './Register';

import Footer from '../../common/Footer';

const Home = props => {
  return (
    <div className={style.container}>
      <LogoHeader />
      <div className={style.content}>
        <div className={style.header + ' left-to-right-anim'}>
          <Header />
        </div>
        <div className={style.auth + ' right-to-left-anim'}>
          <Switch>
            <Route path="/home" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/recover-password" component={RecoverPassword} />
          </Switch>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;