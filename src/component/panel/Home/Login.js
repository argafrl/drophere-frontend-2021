import React, { Component } from "react";
import { Link } from "react-router-dom";
import style from "../../../css/login.module.scss";
import Loading from "../../common/Loading";
import ForgotPassword from "./ForgotPassword";
import { Card, Button, Input, Password } from "@bccfilkom/designsystem/build";
import { UserContext } from "../../../contexts/UserContext";
import { Portal } from "react-portal";
import { Helmet } from "react-helmet";

class Login extends Component {
  static contextType = UserContext;

  state = {
    email: "",
    password: "",
    error: null,
    isLoading: false,
    open: false,
    isShow: false,
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleIsShow = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }

  static id = "loginLoading";

  onSubmitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.context.login(email, password);
  };

  render() {
    return (
      <div className={style.container}>

        <Helmet>
            <title>Login</title>
        </Helmet>

        <Card className={style.form}>
          <div className={style.header}>
            <h1>Masuk</h1>
            <p>
              Belum punya akun? <Link to="/register">Daftar</Link>
            </p>
          </div>

          <form onSubmit={this.onSubmitHandler}>
            <div className={style["form-container"]}>
              <div className={style["input-wrapper"]}>
                <p>Email</p>
                <Input
                  className={style.input}
                  type="email"
                  placeholder="Masukkan Email"
                  required
                  value={this.state.email}
                  handleChange={this.handleChange("email")}
                  style={{ borderRadius: "6px" }}
                  hintText={
                    this.context.error === "entry not found"
                      ? "Email yang anda masukkan tidak valid"
                      : ""
                  }
                  action={
                    this.context.error === "entry not found" ? "error" : ""
                  }
                />
              </div>

              <div className={style["input-wrapper"]}>
                <p>Password</p>
                {/* <Input
                  className={style["input"]}
                  type="password"
                  placeholder="Masukkan Password"
                  required
                  value={this.state.password}
                  handleChange={this.handleChange("password")}
                  style={{ borderRadius: "6px" }}
                  hintText={
                    this.context.error ===
                    "crypto/bcrypt: hashedPassword is not the hash of the given password"
                      ? "Password yang anda masukkan salah"
                      : ""
                  }
                  action={
                    this.context.error ===
                    "crypto/bcrypt: hashedPassword is not the hash of the given password"
                      ? "error"
                      : ""
                  }
                /> */}
                <Password
                className={style["input"]}
                placeholder="Masukkan Password"
                required
                visibilityEye={this.state.isShow}
                value={this.state.password}
                handleChange={this.handleChange("password")}
                handleShow={() => this.handleIsShow()}
                style={{ borderRadius: "6px" }}
                hintText={
                  this.context.error ===
                  "crypto/bcrypt: hashedPassword is not the hash of the given password"
                    ? "Password yang anda masukkan salah"
                    : ""
                }
                action={
                  this.context.error ===
                  "crypto/bcrypt: hashedPassword is not the hash of the given password"
                    ? "error"
                    : ""
                }
                />
              </div>
              <button
                type="button"
                onClick={this.handleClickOpen}
                className={style["lupa-password"]}
              >
                Lupa Password?
              </button>
              <Button className={style["button-masuk"]}>Masuk</Button>
            </div>
            {this.context.isLogin ? <Loading /> : ""}
          </form>
          <Portal>
            <ForgotPassword
              open={this.state.open}
              onClose={this.handleClose}
              value={this.state.email}
              handleChange={this.handleChange("email")}
            />
          </Portal>
        </Card>
      </div>
      
    );
  }
}
export default Login;
