import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../../css/login.module.scss";
import Loading from "../../common/Loading";
import { Card, Button, Input, Password } from "@bccfilkom/designsystem/build";
import { UserContext } from "../../../contexts/UserContext";
import { Helmet } from "react-helmet";
import mainApi from "../../../api/mainApi";
import { getErrorMessage } from "../../../helpers";

const Register = () => {
  const {
    isLogin,
    login,
    error: errorLogin,
    clearError,
  } = useContext(UserContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();
    setError("");
    register(name, email, password);
  };

  const register = async () => {
    try {
      setIsLoading(true);

      const { data } = await mainApi.post("/sign_up", {
        full_name: name,
        email: email,
        password: password,
      });

      if (data.is_success) {
        login(email, password);
      }
    } catch (err) {
      if (
        getErrorMessage(err) ===
        "supabase error: duplicate key value violates unique constraint " +
          '"users_email_key"'
      ) {
        setError("Akun dengan email tersebut sudah terdaftar");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

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
                hintText={error || errorLogin ? error || errorLogin : ""}
                action={error || errorLogin ? "error" : ""}
              />
            </div>
            <div className={style["input-wrapper"]}>
              <p>Password</p>
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
          {isLoading || isLogin ? <Loading /> : ""}
        </form>
      </Card>
    </div>
  );
};

export default Register;
