import React, { useContext, useEffect } from "react";
import style from "../../../css/forgot-password.module.scss";
import Loading from "../../common/Loading";
import { Input, Dialog } from "@bccfilkom/designsystem/build";
import { UserContext } from "../../../contexts/UserContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const ForgotPassword = (props) => {
  const open = props.open;
  const onClose = props.onClose;

  const [state, setState] = React.useState({
    email: "",
    error: "",
    isLoading: false,
    success: false,
  });

  const {
    sendForgotPassword,
    successSendForgotPassword,
    errorSendForgotPassword,
    isSendingForgotPassword,
    clearError,
    resetSendForgotPassword,
  } = useContext(UserContext);
  const snackbar = useContext(SnackbarContext);

  const handleChange = (name) => {
    return (event) => {
      setState({ ...state, [name]: event.target.value });
    };
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    sendForgotPassword(state.email);
  };

  const onCancelHandler = (event) => {
    event.preventDefault();
    onClose();
    clearError();
    document.getElementById("reset-password-form").value = "";
    setTimeout(() => resetSendForgotPassword(), 1000);
  };

  useEffect(() => {
    if (errorSendForgotPassword === "Request failed with status code 500") {
      snackbar.error("Email yang anda masukkan tidak valid");
    } else if (errorSendForgotPassword) {
      snackbar.error(errorSendForgotPassword);
    }
    clearError();
  }, [errorSendForgotPassword, snackbar]);

  return (
    <div className={style["forgot-password"]}>
      <form onSubmit={onSubmitHandler} id="reset-password-form">
        <Dialog
          className={style.dialog}
          visible={open}
          onCancel={onClose}
          primaryButton={{
            text: successSendForgotPassword ? "Ok, Mengerti" : "Konfirmasi",
            onClick: successSendForgotPassword ? onCancelHandler : () => {},
          }}
          secondaryButton={
            !successSendForgotPassword
              ? {
                  text: "Batalkan",
                  onClick: onCancelHandler,
                }
              : ""
          }
        >
          <div className={style.content}>
            <div id="alert-dialog-description">
              {successSendForgotPassword ? (
                <div className={style["content-container"]}>
                  <h1>Link Berhasil Terkirim!</h1>
                  <p>
                    Kami telah mengirim link ke{" "}
                    <span style={{ color: "#2196F3" }}>{state.email}</span>
                    {". "}
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
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={style.actions}>
            {state.error ? (
              <div className="error">{state.error.message}</div>
            ) : (
              ""
            )}
          </div>
          {state.isLoading ? <Loading /> : ""}
        </Dialog>
      </form>
    </div>
  );
};

export default ForgotPassword;
