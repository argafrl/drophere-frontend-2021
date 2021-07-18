import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { TokenContext } from './contexts/token';
import AppRouter from './AppRouter';
import * as serviceWorker from './serviceWorker';
import { isString } from 'util';

class App extends Component {
  state = {
    token: "drophereNew",
    setToken: (newToken) => {
      localStorage.setItem('bccdrophere_token', newToken);
      if (isString(newToken) && newToken.length > 0) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        axios.defaults.headers.common['Authorization'] = '';
      }
      this.setState({
        token: localStorage.getItem('bccdrophere_token'),
      })
    },
  };
  render() {
    return (
      <TokenContext.Provider value={this.state}>
        <AppRouter />
      </TokenContext.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
