import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/login.module.scss';
import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';

class Register extends Component {
  state = {
    name: '',
    password: '',
    email: '',
    error: null,
    isLoading: false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  onSubmitHandler = async (e) => {
    e.preventDefault();
    const { email, name, password } = this.state;

    try {
      this.setState({ isLoading: true });
      const resp = await axios.post(endpointURL, {
        query: `
        mutation register($email:String!,$name:String!,$password:String!){
          register(email:$email,name:$name,password:$password){
            loginToken
          }
        }
      `,
        variables: {
          email,
          name,
          password,
        },
        operationName: 'register',
      })
      const registerResp = resp.data.data.register;
      if (registerResp) {
        this.context.setToken(registerResp.loginToken);
        this.setState({ isLoading: false });
        return;
      }
      throw new Error(resp.data.errors[0].message);
    } catch (err) {
      this.setState({ isLoading: false, error: err });
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
                type='text'
                label='Name'
                fullWidth
                required
                icon='account_circle'
                value={this.state.name}
                onChange={this.handleChange('name')}
              />
              <Input
                type='email'
                label='Email'
                fullWidth
                required
                icon='email'
                value={this.state.email}
                onChange={this.handleChange('email')}
              />
              <Input
                type='password'
                label='Password'
                fullWidth
                required
                icon='lock'
                value={this.state.password}
                onChange={this.handleChange('password')}
              />

              {this.state.error ? <div className="error">{this.state.error.message}</div> : ''}
              <button className="custom-button">Daftar</button>
            </div>
            {this.state.isLoading ? <Loading /> : ''}
          </form>
        </div>

        <div className={style.footer}>
          <p>Sudah memiliki akun? <Link to="/home">Masuk</Link></p>
        </div>
      </div>
    );
  }
}
Register.contextType = TokenContext;

export default Register;