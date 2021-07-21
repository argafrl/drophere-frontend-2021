import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/login.module.scss';
// import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';

import { Card, Button, Input, Dialog } from '@bccfilkom/designsystem/build';
import WarningIcon from '@material-ui/icons/Warning';
import { InputAdornment } from '@material-ui/core';

class Login extends Component {

  // const [visible, setVisible] = useState(0);

  state = {
    email: '',
    password: '',
    error: null,
    isLoading: false,
    visible: 0,
    inputRef: 0,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  // onClick = (e) => {
  //   this.setState({ visible: e.target.value });
  // }

  onClick = () => {
    this.setState( {
      visible: 0
    })
  }
  
  onClicks = () => {
    this.setState( {
      visible: 1
    })
  }

  onCancel = () => {
    this.setState({
      visible: 0
    })
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
              <p className={style['lupa-password']}><Link to="/recover-password">Lupa password?</Link></p>

              {/* <Button onClick={function onClick(){return setVisible(!0)}}> */}
              {/* <Button onClick={ this.onClicks }>
                Show Dialog
              </Button>
              <Dialog
                onCancel={ this.onCancel }
                primaryButton={{
                  onClick: this.onClick,
                  text: 'Lanjut'
                }}
                secondaryButton={{
                  onClick: this.onClick,
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
        </Card>
      </div>
    );
  }
}
Login.contextType = TokenContext;

export default Login;