import React, { Component } from "react";
import style from '../../../css/home.module.scss';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Footer from '../../common/Footer';
import { Route, Switch } from 'react-router-dom';

const Home = props => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.header + ' left-to-right-anim'}>
          <Header />
        </div>
        <div className={style.auth + ' right-to-left-anim'}>
          <Switch>
            <Route path="/home" exact component={Login} />
            <Route path="/register" exact component={Register} />
          </Switch>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;