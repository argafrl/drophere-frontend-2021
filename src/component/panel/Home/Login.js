import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/login.module.scss';
// import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';

import { Card, Button, Input, Dialog } from '@bccfilkom/designsystem/build';

class Login extends Component {

  // const [visible, setVisible] = useState(0);

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
        <Card className={style.form}>

        {/* <div className={style.header}>
          <h1>Kumpulkan Filemu di Sini!</h1>
          <p>Dapatkan kemudahan dalam menerima filemu di sini</p>
        </div> */}

        <div className={style.header}>
          <h1>Masuk</h1>
          {/* <p>Belum punya akun? Daftar</p> */}
          <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
        </div>

          <div >
            <form onSubmit={this.onSubmitHandler}>
              <div className={style['form-container']}>
                
                <div className={style['input-wrapper']}>
                  <p>Email</p>
                  <Input
                    className="input"
                    type="email"
                    placeholder='Email'
                    // fullWidth
                    required
                    value={this.state.email}
                    // onChange={this.handleChange('email')}
                    handleChange={this.handleChange('email')}
                  />
                </div>

                <div className={style['input-wrapper']}>
                  <p>Password</p>
                  <Input
                    className={style['input']}
                    type='password'
                    placeholder='Password'
                    // fullWidth
                    required
                    value={this.state.password}
                    // onChange={this.handleChange('password')}
                    handleChange={this.handleChange('password')}
                  />
                </div>

                {this.state.error ? <div className="error">{this.state.error.message}</div> : ''}
                <p className={style['lupa-password']}><Link to="/recover-password">Lupa password?</Link></p>

                {/* <Button onClick={function onClick(){return setVisible(!0)}}>
                  Show Dialog
                </Button>
                <Dialog
                  onCancel={function onCancel(){return setVisible(!1)}}
                  primaryButton={{
                    onClick: function onClick(){return setVisible(!1)},
                    text: 'Lanjut'
                  }}
                  secondaryButton={{
                    onClick: function onClick(){return console.log("Nope.")},
                    text: 'Hapus'
                  }}
                  title="Title"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. Duis quis odio ultrices, cursus lacus ac, posuere felis.
                </Dialog> */}
                {/* <button className="custom-button">Masuk</button> */}
                <Button className={style['button-masuk']}>Masuk</Button>
                
              </div>
              {this.state.isLoading ? <Loading /> : ''}
            </form>
          </div>
          {/* <Button
            condensed
            type="text"
          >
            Read More
          </Button> */}
      </Card>
        {/* <div className={style.header}>
          <h1>Kumpulkan Filemu di Sini!</h1>
          <p>Dapatkan kemudahan dalam menerima filemu di sini</p>
        </div> */}

        {/* <div className={style.form}>
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
        </div> */}

        {/* <div className={style.footer}>
          <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
          <p>Lupa password? <Link to="/recover-password">Pulihkan</Link></p>
        </div> */}
      </div>
    );
  }
}
Login.contextType = TokenContext;

export default Login;