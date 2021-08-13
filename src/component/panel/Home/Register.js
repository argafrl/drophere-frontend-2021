import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import mainApi from '../../../api/mainApi';

import style from '../../../css/login.module.scss';
// import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';

import { Card, Button, Input } from '@bccfilkom/designsystem/build';
import { UserContext } from '../../../contexts/UserContext';

class Register extends Component {
  static contextType = UserContext;

  state = {
    name: '',
    password: '',
    passwordBaru: '',
    email: '',
    error: null,
    isLoading: false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  // onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   const { email, name, password } = this.state;

  //   try {
  //     this.setState({ isLoading: true });
  //     const resp = await axios.post(endpointURL, {
  //       query: `
  //       mutation register($email:String!,$name:String!,$password:String!){
  //         register(email:$email,name:$name,password:$password){
  //           loginToken
  //         }
  //       }
  //     `,
  //       variables: {
  //         email,
  //         name,
  //         password,
  //       },
  //       operationName: 'register',
  //     })
  //     const registerResp = resp.data.data.register;
  //     if (registerResp) {
  //       this.context.setToken(registerResp.loginToken);
  //       this.setState({ isLoading: false });
  //       return;
  //     }
  //     throw new Error(resp.data.errors[0].message);
  //   } catch (err) {
  //     this.setState({ 
  //       isLoading: false, 
  //       error: err.message });
  //   }
  // }

  handleSignup = async(e) => {
    e.preventDefault();

    const { email, name, password } = this.state;

    await mainApi.post("sign_up", {
        full_name:  name,
        email: email,
        password: password
    }).then((res) => {
      if(res.data.is_success == true){
        this.context.login(email, password);
      }
    }).catch(err => {
      this.setState({ 
        isLoading: false, 
        error: err.response.data.message 
      });
    }) 
  }

  render() {
    return (
      <div className={style.container}>
        <Card className={style.form}>

          <div className={style.header}>
            <h1>Daftar Sekarang</h1>
            <p>Sudah punya akun? <Link to="/home">Masuk</Link></p>
          </div>

          <form onSubmit={this.handleSignup}>
            <div className={style['form-container']}>

              <div className={style['input-wrapper']}>
                <p>Nama</p>
                <Input
                  className={style['input']}
                  type='text'
                  placeholder='Masukkan Nama'
                  // label='Name'
                  // fullWidth
                  required
                  // icon='account_circle'
                  value={this.state.name}
                  handleChange={this.handleChange('name')}
                  style={{borderRadius: "6px"}}
                />
              </div>
              
              <div className={style['input-wrapper']}>
                <p>Email</p>
                <Input
                  className={style['input']}
                  type="email"
                  placeholder='Masukkan Email'
                  required
                  value={this.state.email}
                  handleChange={this.handleChange('email')}
                  style={{borderRadius: "6px"}}
                  // hintText={this.state.error == "Error: Duplicated email" ? `Akun dengan email ${this.state.email} sudah terdaftar` : '' }
                  hintText={this.state.error === "supabase error: duplicate key value violates unique constraint " + "\"users_email_key\"" ? `Akun dengan email tersebut sudah terdaftar` : '' }
                  action={this.state.error === "supabase error: duplicate key value violates unique constraint " + "\"users_email_key\"" ? "error" : ''}
                />
              </div>

              <div className={style['input-wrapper']}>
                <p>Password</p>
                <Input
                  className={style['input']}
                  type='password'
                  placeholder='Masukkan Password'    
                  required
                  value={this.state.password}
                  handleChange={this.handleChange('password')}
                  style={{borderRadius: "6px"}}
                />
              </div>

              {/* <div className={style['input-wrapper']}>
                <p>Ulangi Password</p>
                <Input
                  className={style['input']}
                  type='password'
                  placeholder='Masukkan Kembali Password'
                  // fullWidth
                  required
                  value={this.state.passwordBaru}
                  // onChange={this.handleChange('password')}
                  handleChange={this.handleChange('passwordBaru')}
                  style={{borderRadius: "6px"}}
                />
              </div> */}

              {/* {this.state.error ? <div className="error">{this.state.error}</div> : ''} */}
              {this.state.error}
              {this.state.error === "supabase error: duplicate key value violates unique constraint " + "users_pkey" ? <div className="error">Email sudah digunakan</div> : ''}
              <Button className={style['button-daftar']}>Daftar</Button>
              
            </div>
            {this.state.isLoading ? <Loading /> : ''}
          </form>

        </Card>
      </div>
    );
  }
}
// Register.contextType = TokenContext;

export default Register;