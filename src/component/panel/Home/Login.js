import React, { Component } from "react";
import { Link } from "react-router-dom";
import style from "../../../css/login.module.scss";
import Loading from "../../common/Loading";
import ForgotPassword from "../../common/ForgotPassword";
import { Card, Button, Input, Dialog } from "@bccfilkom/designsystem/build";
import { UserContext } from "../../../contexts/UserContext";
import { Portal } from "react-portal";

class Login extends Component {
  static contextType = UserContext;

  state = {
    email: "",
    password: "",
    error: null,
    isLoading: false,
    open: false,
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

  static id = "loginLoading";

  onSubmitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.context.login(email, password);
  };

  render() {
    return (
      <div className={style.container}>
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
                  // icon='./img/bcc-logo-horizontal.png'
                  // icon='../../../../public/img/background-diagonal.png'
                  // icon={{WarningIcon}}
                  className={style.input}
                  type="email"
                  placeholder="Masukkan Email"
                  required
                  value={this.state.email}
                  handleChange={this.handleChange("email")}
                  style={{ borderRadius: "6px" }}
                  // hintText={this.state.error == "Error: User not found" ? this.state.error.message : ''}
                  // hintText={this.state.error == "Error: User not found" && this.state.email != '' ? "Email yang anda masukkan tidak valid" : '' }
                  hintText={
                    this.context.error === "entry not found"
                      ? "Email yang anda masukkan tidak valid"
                      : ""
                  }
                  action={this.context.error === "entry not found" ? "error" : ""}
                  // style={this.state.error == "Error: User not found" ? { borderColor: "#E84C3D", borderRadius: "6px" } : { borderRadius: "6px" } }
                  // ref={this.state.inputRef}
                />
              </div>

              <div className={style["input-wrapper"]}>
                <p>Password</p>
                <Input
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
                  // style={this.state.error == "Error: Invalid password" ? { borderColor: "#E84C3D", borderRadius: "6px" } : { borderRadius: "6px" } }
                />
              </div>
              {/* {this.context.error === "entry not found" ? <div className="error">Akun tidak ditemukan</div> : ''} */}

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
          {/* <Portal>
            <Dialog
              title="Title"
              visible={this.state.open}
              onCancel={this.handleClose}
              primaryButton={{
                text: "Lanjut",
                onClick: this.handleClose,
              }}
              secondaryButton={{
                text: "Hapus",
                onClick: this.handleClose,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse cursus fermentum risus, sit amet fringilla nunc
              pellentesque quis. Duis quis odio ultrices, cursus lacus ac,
              posuere felis.
            </Dialog>
          </Portal> */}

          {/* <Button onClick={ this.handleClickOpen }>
            Show Dialog
          </Button> */}
        </Card>
      </div>
    );
  }
}
export default Login;
