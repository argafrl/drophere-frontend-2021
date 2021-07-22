import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/login.module.scss';
// import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';
import ForgotPassword from '../../common/ForgotPassword';

import { Card, Button, Input } from '@bccfilkom/designsystem/build';
import WarningIcon from '@material-ui/icons/Warning';
import { Dialog, DialogActions, DialogContent, DialogContentText, InputAdornment } from '@material-ui/core';

class Login extends Component {

  // const [visible, setVisible] = useState(0);

  state = {
    email: '',
    password: '',
    error: null,
    isLoading: false,
    open: false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  // onClick = (e) => {
  //   this.setState({ visible: e.target.value });
  // }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClose = () => {
    this.setState({ 
      open: false
     });
     
  };

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
      // if(err == "Error: User not found"){
      //   err = "Email yang anda masukkan tidak valid";
      // }
      // console.log(err);
      this.setState({
        error: err,
        isLoading: false,
      });
      // console.log(err)
      // document.getElementById("inputEmail").select();
    }

  }

  render() {
    return (
      <div className={style.container}>
        <Card className={style.form}>

          <div className={style.header}>
            <h1>Masuk</h1>
            <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
          </div>

          <form onSubmit={this.onSubmitHandler}>
            <div className={style['form-container']}>
              
              <div className={style['input-wrapper']}>
                <p>Email</p>
                <Input
                  // icon='./img/bcc-logo-horizontal.png'
                  // icon='../../../../public/img/background-diagonal.png'
                  // icon={{WarningIcon}}
                  className={style.input}
                  type="email"
                  placeholder='Masukkan Email'
                  required
                  value={this.state.email}
                  handleChange={this.handleChange('email')}
                  style={{borderRadius: "6px"}}
                  // hintText={this.state.error == "Error: User not found" ? this.state.error.message : ''}
                  // hintText={this.state.error == "Error: User not found" && this.state.email != '' ? "Email yang anda masukkan tidak valid" : '' }
                  hintText={this.state.error == "Error: User not found" ? "Email yang anda masukkan tidak valid" : '' }
                  action={this.state.error == "Error: User not found" ? "error" : ''}
                  // style={this.state.error == "Error: User not found" ? { borderColor: "#E84C3D", borderRadius: "6px" } : { borderRadius: "6px" } }
                  // ref={this.state.inputRef}
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
                  hintText={this.state.error == "Error: Invalid password" ? "Password yang anda masukkan salah" : ''}
                  action={this.state.error == "Error: Invalid password" ? "error" : ''}
                  // style={this.state.error == "Error: Invalid password" ? { borderColor: "#E84C3D", borderRadius: "6px" } : { borderRadius: "6px" } }
                />
              </div>

              {/* {this.state.error ? <div className="error">{this.state.error.message}</div> : ''} */}
              {/* <p className={style['lupa-password']}><Link to="/recover-password">Lupa password?</Link></p> */}
              <a onClick={ this.handleClickOpen }><p className={style['lupa-password']}>Lupa Password?</p></a>
              
              {/* <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='xs'
                className={style.dialog}
              >
                <DialogContent className={style.content}>
                  <DialogContentText id="alert-dialog-description">
                    <h1>Lupa Password?</h1>
                    <p>Masukkan email anda dan kami akan mengirim link untuk mengatur ulang password anda.</p>
                    <div className={style['input-wrapper']}>
                      <p>Email</p>
                      <Input
                        className={style.input}
                        type="email"
                        placeholder='Masukkan Email'
                        required
                        value={this.state.email}
                        handleChange={this.handleChange('email')}
                        style={{borderRadius: "6px"}}
                      />
                    </div>
                  </DialogContentText>
                </DialogContent>
                <DialogActions className={style.actions}>
                  <Button onClick={this.handleClose} type="text">
                    Batalkan
                  </Button>
                  <Button onClick={this.handleClose} type="primary" autoFocus>
                    Konfirmasi
                  </Button>
                </DialogActions>
              </Dialog> */}

              {/* <Button onClick={function onClick(){return setVisible(!0)}}> */}
              
              {/* <button className="custom-button">Masuk</button> */}
              <Button className={style['button-masuk']}>Masuk</Button>
              
            </div>
            {this.state.isLoading ? <Loading /> : ''}
          </form>

          <ForgotPassword 
            open={this.state.open}
            onClose={this.handleClose}
            value={this.state.email}
            handleChange={this.handleChange('email')} />
          {/* <Button onClick={ this.handleClickOpen }>
            Show Dialog
          </Button> */}
          
        </Card>
      </div>
    );
  }
}
Login.contextType = TokenContext;

export default Login;