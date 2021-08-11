import React from "react";

import { useSnackbar } from "notistack";
import Axios from "axios";

import { endpointURL } from "../../config";

import style from "../../css/forgot-password.module.scss";

import Loading from "./Loading";

import { Button, Input, Dialog } from "@bccfilkom/designsystem/build";
import {
  // Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";

const ForgotPassword = (props) => {
  const open = props.open;
  const onClose = props.onClose;

  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    email: "",
    error: "",
    isLoading: false,
    success: false,
  });

  const handleChange = (name) => {
    return (event) => {
      setState({ ...state, [name]: event.target.value });
    };
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setState({ ...state, isLoading: true });
    requestPasswordRecovery(state.email);
  };

  const onCancelHandler = (event) => {
    event.preventDefault();
    onClose();
    document.getElementById("reset-password-form").value = "";
    setTimeout(
      () =>
        setState({
          ...state,
          success: false,
        }),
      1000
    );
    // setState({
    //     ...state,
    //     success: false,
    // })
  };

  const requestPasswordRecovery = async (email) => {
    try {
      const resp = await Axios.post(endpointURL, {
        query: `
            mutation requestPasswordRecovery($email:String!){
              requestPasswordRecovery(email:$email){
                message
              }
            }`,
        variables: {
          email,
        },
        operationName: "requestPasswordRecovery",
      });

      if (resp.data.errors) {
        throw new Error(resp.data.errors[0].message);
      }
      const requestPasswordRecoveryResp =
        resp.data.data.requestPasswordRecovery;
      if (requestPasswordRecoveryResp) {
        //   enqueueSnackbar(requestPasswordRecoveryResp.message, {
        //     variant: "success",
        //     preventDuplicate: true,
        //   })
        setState({
          ...state,
          success: true,
        });
      }
      // setState({
      //   ...state,
      //   email: '',
      //   isLoading: false,
      // })
    } catch (error) {
      enqueueSnackbar(error.message, {
        preventDuplicate: true,
        variant: "error",
      });
      setState({
        ...state,
        isLoading: false,
      });
    }
  };

  return (
    <div className={style["forgot-password"]}>
      
      <Dialog
        className={style.dialog}
        title="Title"
        visible={open}
        onCancel={onClose}
        primaryButton={{
          text: "Lanjut",
          onClick: onClose,
        }}
        secondaryButton={{
          text: "Hapus",
          onClick: onClose,
        }}
      >
        <form onSubmit={onSubmitHandler} id="reset-password-form">
          <DialogContent className={style.content}>
            <DialogContentText id="alert-dialog-description">
              {state.success ? (
                <div className={style["content-container"]}>
                  <h1>Link Berhasil Terkirim!</h1>
                  <p>
                    Kami telah mengirim link ke{" "}
                    <span style={{ color: "#2196F3" }}>{state.email}</span>{" "}
                    Silahkan periksa email anda untuk instruksi lebih lanjut.
                  </p>
                </div>
              ) : (
                <div className={style["content-container"]}>
                  <h1>Lupa Password?</h1>
                  <p>
                    Masukkan email anda dan kami akan mengirim link untuk
                    mengatur ulang password anda.
                  </p>
                  <div className={style["input-wrapper"]}>
                    <p>Email</p>
                    <Input
                      className={style.input}
                      type="email"
                      placeholder="Masukkan Email"
                      required
                      value={state.email}
                      handleChange={handleChange("email")}
                      style={{
                        borderRadius: "6px",
                        width: "100%",
                        marginBottom: "5px",
                      }}
                      // hintText={state.error}
                      // action={state.error}
                    />
                  </div>
                </div>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions className={style.actions}>
            {state.error ? (
              <div className="error">{state.error.message}</div>
            ) : (
              ""
            )}
            {state.success ? (
              <div className={style["actions-wrapper"]}>
                <Button onClick={onCancelHandler} type="primary" autoFocus>
                  Ok, Mengerti
                </Button>
              </div>
            ) : (
              <div className={style["actions-wrapper"]}>
                <Button onClick={onCancelHandler} type="text">
                  Batalkan
                </Button>
                <Button
                  className={style["button-confirm"]}
                  type="primary"
                  autoFocus
                >
                  Konfirmasi
                </Button>
              </div>
            )}
            {/* <Button onClick={onCancelHandler} type="text">
                        Batalkan
                    </Button>
                    <Button type="primary" autoFocus>
                        Konfirmasi
                    </Button> */}
          </DialogActions>
          {state.isLoading ? <Loading /> : ""}
        </form>
      </Dialog>
    </div>
  );
};

export default ForgotPassword;
