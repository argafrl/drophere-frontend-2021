import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../../css/login.module.scss";
import Loading from "../../common/Loading";
import ForgotPassword from "./ForgotPassword";
import { Card, Button, Input, Password } from "@bccfilkom/designsystem/build";
import { UserContext } from "../../../contexts/UserContext";
import { Portal } from "react-portal";
import { Helmet } from "react-helmet";

const Login = () => {
  const { isLogin, error, clearError, login } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordShown, showForgotPassword] = useState(false);
  const [passwordShown, showPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleClick = () => {
    setEmail("");
    setPassword("");
    showForgotPassword(true);
  };

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <form onSubmit={onSubmitHandler}>
          <div className={style["form-container"]}>
            <div className={style["input-wrapper"]}>
              <p>Email</p>
              <Input
                className={style.input}
                type="email"
                placeholder="Masukkan Email"
                required
                value={email}
                handleChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: "6px" }}
                hintText={
                  error === "entry not found"
                    ? "Email yang anda masukkan tidak valid"
                    : ""
                }
                action={error === "entry not found" ? "error" : ""}
              />
            </div>
            <div className={style["input-wrapper"]}>
              <p>Password</p>
              <Password
                className={style["input"]}
                placeholder="Masukkan Password"
                required
                visibilityEye={passwordShown}
                value={password}
                handleChange={(e) => setPassword(e.target.value)}
                handleShow={() => showPassword(!passwordShown)}
                style={{ borderRadius: "6px" }}
                hintText={
                  error ===
                  "crypto/bcrypt: hashedPassword is not the hash of the given password"
                    ? "Password yang anda masukkan salah"
                    : ""
                }
                action={
                  error ===
                  "crypto/bcrypt: hashedPassword is not the hash of the given password"
                    ? "error"
                    : ""
                }
              />
            </div>
            <button
              type="button"
              onClick={handleClick}
              className={style["lupa-password"]}
            >
              Lupa Password?
            </button>
            <Button className={style["button-masuk"]}>Masuk</Button>
          </div>
          {isLogin && <Loading />}
        </form>
        <Portal>
          <ForgotPassword
            open={forgotPasswordShown}
            onClose={() => showForgotPassword(false)}
            value={email}
            handleChange={() => setEmail("")}
          />
        </Portal>
      </Card>
    </div>
  );
};

export default Login;
