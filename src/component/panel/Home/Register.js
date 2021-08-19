import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../../css/login.module.scss";
import Loading from "../../common/Loading";
import { Card, Button, Input, Password } from "@bccfilkom/designsystem/build";
import { UserContext } from "../../../contexts/UserContext";
import { Helmet } from "react-helmet";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const Register = () => {
  const { error, register, isRegister, clearError, isLogin } =
    useContext(UserContext);
  const snackbar = useContext(SnackbarContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [errorRegister, setErrorRegister] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();
    register(name, email, password);
  };

  useEffect(() => {
    if(error == "supabase error: duplicate key value violates unique constraint " + '"users_email_key"'){
      snackbar.error("Akun dengan email tersebut sudah terdaftar");
      setErrorRegister(error);
    } else if (error){
      snackbar.error(error);
      setErrorRegister(error);
    }
    clearError();
  }, [error, snackbar])

  return (
    <div className={style.container}>

      <Helmet>
          <title>Register</title>
      </Helmet>

      <Card className={style.form}>
        <div className={style.header}>
          <h1>Daftar Sekarang</h1>
          <p>
            Sudah punya akun? <Link to="/home">Masuk</Link>
          </p>
        </div>
        <form onSubmit={handleSignup}>
          <div className={style["form-container"]}>
            <div className={style["input-wrapper"]}>
              <p>Nama</p>
              <Input
                className={style["input"]}
                type="text"
                placeholder="Masukkan Nama"
                required
                value={name}
                handleChange={(e) => setName(e.target.value)}
                style={{ borderRadius: "6px" }}
              />
            </div>
            <div className={style["input-wrapper"]}>
              <p>Email</p>
              <Input
                className={style["input"]}
                type="email"
                placeholder="Masukkan Email"
                required
                value={email}
                handleChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: "6px" }}
                hintText={
                  errorRegister ==
                  "supabase error: duplicate key value violates unique constraint " +
                    '"users_email_key"'
                    ? `Akun dengan email tersebut sudah terdaftar`
                    : ""
                }
                action={
                  errorRegister ==
                  "supabase error: duplicate key value violates unique constraint " +
                    '"users_email_key"'
                    ? "error"
                    : ""
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
                value={password}
                handleChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: "6px" }}
              /> */}
              <Password
                className={style["input"]}
                type="password"
                placeholder="Masukkan Password"
                required
                value={password}
                visibilityEye={isShow}
                handleChange={(e) => setPassword(e.target.value)}
                handleShow={() => setIsShow(!isShow)}
                style={{ borderRadius: "6px" }}
              />
            </div>
            <Button className={style["button-daftar"]}>Daftar</Button>
          </div>
          {isRegister || isLogin ? <Loading /> : ""}
        </form>
      </Card>
    </div>
  );
};

export default Register;
