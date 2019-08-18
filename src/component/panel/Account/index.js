import React, { Component } from 'react';
import axios from 'axios';

import { TokenContext } from '../../../contexts/token';
import { UserContext } from '../../../contexts/user';
import { endpointURL } from '../../../config';

import style from '../../../css/account.module.scss';
import Header from '../../common/Header'
import Footer from '../../common/Footer'

import Content from './Content';

export default class Account extends Component {
  static contextType = TokenContext;

  state = {
    user: null,
    setUser: (newUser) => {
      this.setState({
        user: newUser,
      })
    }
  }

  async componentDidMount() {
    try {

      const resp = await axios.post(endpointURL, {
        query: `
        query {
          me {
            email
            name
            connectedStorageProviders {
              id
              providerId
            }
          }
        }`
      })
      if (resp.data.errors) {
        this.context.setToken('');
        this.props.history.push('/home');
        return;
      }

      this.setState({ user: resp.data.data.me })
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
          <UserContext.Provider value={this.state}>
            <Content  {...this.props} />
          </UserContext.Provider>
        </div>

        <Footer />
      </div>
    );
  }
}