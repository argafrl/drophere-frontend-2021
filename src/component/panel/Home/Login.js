import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/login.module.scss';
import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: null,
    isLoading: false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  static id = "loginLoading"

  onSubmitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      this.setState({ isLoading: true });
      const resp = await axios.post(endpointURL, {
        query: `
      mutation login($email:String!,$password:String!){
        login(email:$email, password:$password){
          loginToken
        }
      }
      `,
        variables: {
          email,
          password,
        },
        operationName: 'login',
      })
      const loginResp = resp.data.data.login;
      if (loginResp) {
        this.context.setToken(loginResp.loginToken);
        this.setState({ isLoading: false });
        return;
      }
      throw new Error(resp.data.errors[0].message);
    } catch (err) {
      this.setState({
        error: err,
        isLoading: false,
      });
    }

  }

  render() {
    return (
      <div className={style.container}>
        <div className={style.header}>
          <h1>Kumpulkan Filemu di Sini!</h1>
          <p>Dapatkan kemudahan dalam menerima filemu di sini</p>
        </div>

        <div className={style.form}>
          <form onSubmit={this.onSubmitHandler}>
            <div className={style['form-container']}>
              <Input
                type="email"
                label='Email'
                fullWidth
                required
                value={this.state.email}
                onChange={this.handleChange('email')}
              />
              <Input
                type='password'
                label='Password'
                fullWidth
                required
                value={this.state.password}
                onChange={this.handleChange('password')}
              />

              {this.state.error ? <div className="error">{this.state.error.message}</div> : ''}
              <button className="custom-button">Masuk</button>
            </div>
            {this.state.isLoading ? <Loading /> : ''}
          </form>
        </div>

        <div className={style.footer}>
          <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
        </div>
      </div>
    );
  }
}
Login.contextType = TokenContext;

export default Login;