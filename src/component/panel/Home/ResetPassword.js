import React from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";

import { endpointURL } from "../../../config";

import homeStyle from "../../../css/home.module.scss";
import loginStyle from "../../../css/login.module.scss";

import Footer from "../../common/Footer";
import Loading from "../../common/Loading";

import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import { TokenContext } from "../../../contexts/token";

const ResetPassword = (props) => {
  const [state, setState] = React.useState({
    newPassword: "",
    retypePassword: "",

    newPasswordErr: null,
    retypePasswordErr: null,

    error: "",
    isLoading: false,
    redirectToAccountPage: false,
  });

  const queries = new URLSearchParams(props.location.search);

  const email = queries.get("email") || "";
  const token = queries.get("token") || "";

  const handleChange = (name) => {
    return (event) => {
      setState({ ...state, [name]: event.target.value });
    };
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const { retypePassword, newPassword } = state;

    let hasError = false;
    let errorStates = {
      newPasswordErr: null,
      retypePasswordErr: null,
    };

    // check retype password to match new password
    if (retypePassword !== newPassword) {
      errorStates = {
        ...errorStates,
        retypePasswordErr: new Error("Password tidak cocok"),
      };
      hasError = true;
    }

    // check for empty new password
    if (newPassword.length <= 0) {
      errorStates = {
        ...errorStates,
        newPasswordErr: new Error("Password tidak boleh kosong"),
      };
      hasError = true;
    }

    if (retypePassword.length <= 0) {
      errorStates = {
        ...errorStates,
        retypePasswordErr: new Error("Password tidak boleh kosong"),
      };
      hasError = true;
    }

    setState({
      ...state,
      ...errorStates,
      isLoading: !hasError,
    });
    if (hasError) {
      return;
    }

    recoverPassword(newPassword);
  };

  const recoverPassword = async (newPassword) => {
    try {
      const resp = await Axios.post(endpointURL, {
        query: `
        mutation recoverPassword($email:String!, $token:String!, $newPassword:String!){
          recoverPassword(email:$email, recoverToken:$token,newPassword:$newPassword){
            loginToken
          }
        }`,
        variables: {
          email,
          token,
          newPassword,
        },
        operationName: "recoverPassword",
      });

      if (resp.data.errors) {
        throw new Error(resp.data.errors[0].message);
      }
      const recoverPasswordResp = resp.data.data.recoverPassword;

      if (
        recoverPasswordResp &&
        props.context !== null &&
        props.context !== undefined
      ) {
        props.context.setToken(recoverPasswordResp.loginToken);
      }

      setState({
        ...state,
        newPassword: "",
        retypePassword: "",
        newPasswordErr: null,
        retypePasswordErr: null,
        isLoading: false,
        redirectToAccountPage: true,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
      });
    }
  };

  if (state.redirectToAccountPage) {
    return <Redirect to="/account" />;
  }

  return (
    <div className={homeStyle.container}>
      <div className={homeStyle.content}>
        <div className={loginStyle.container}>
          <div className={loginStyle.header}>
            <h1>Atur Password Baru</h1>
          </div>

          <div className={loginStyle.form}>
            <form onSubmit={onSubmitHandler}>
              <div className={loginStyle["form-container"]}>
                <TextField
                  type="password"
                  label="New Password"
                  disabled={state.isLoading}
                  fullWidth
                  helperText={
                    state.newPasswordErr ? state.newPasswordErr.message : ""
                  }
                  error={state.newPasswordErr != null}
                  name="new_password"
                  value={state.newPassword}
                  onChange={handleChange("newPassword")}
                />

                <TextField
                  type="password"
                  label="Retype Password"
                  disabled={state.isLoading}
                  fullWidth
                  name="retype_password"
                  helperText={
                    state.retypePasswordErr
                      ? state.retypePasswordErr.message
                      : ""
                  }
                  error={state.retypePasswordErr != null}
                  value={state.retypePassword}
                  onChange={handleChange("retypePassword")}
                />

                {state.error ? (
                  <div className="error">{state.error.message}</div>
                ) : (
                  ""
                )}
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Simpan
                  <Icon style={{ fontSize: 20, marginLeft: 8 }}>save</Icon>
                </Button>
              </div>
              {state.isLoading ? <Loading /> : ""}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default (props) => (
  <TokenContext.Consumer>
    {(value) => <ResetPassword {...props} context={value} />}
  </TokenContext.Consumer>
);
