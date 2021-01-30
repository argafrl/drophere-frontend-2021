import React, { Component } from 'react';
import axios from 'axios';

import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/account.module.scss';
import Header from '../../common/Header'
import Footer from '../../common/Footer'

import Content from './Content';

export default class Account extends Component {
  static contextType = TokenContext;

  async componentDidMount() {
    try {

      const resp = await axios.post(endpointURL, {
        query: `
        query {
          me {
            email
            name
          }
        }`
      })
      if (resp.data.errors) {
        this.context.setToken('');
        this.props.history.push('/home');
        return;
      }
    } catch (error) {
      this.context.setToken('');
      this.props.history.push('/home');
    }
  }

  render() {
    return (

      <div className={style.container}>
        <Header />

        <div className={style['content-wrapper']}>
          <Content  {...this.props} />
        </div>

        <Footer />
      </div>
    );
  }
}