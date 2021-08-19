import React, { useContext, useState } from "react";
import style from "../../../css/forgot-password.module.scss";
import Loading from "../../common/Loading";
import { Input, Dialog } from "@bccfilkom/designsystem/build";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import mainApi from "../../../api/mainApi";
import { getErrorMessage } from "../../../helpers";

const ForgotPassword = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [successSendEmail, setSuccessSendEmail] = useState(false);

  const snackbar = useContext(SnackbarContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    sendForgotPasswordEmail(email);
  };

  const onCancelHandler = (e) => {
    if (e) {
      e.preventDefault();
    }
    onClose();
    setTimeout(() => {
      setError("");
      setEmail("");
    }, 100);
  };

  const sendForgotPasswordEmail = async (email) => {
    try {
      setIsSendingEmail(true);

      await mainApi.get("/forgot-password", {
        params: {
          email: email,
        },
      });

      setSuccessSendEmail(true);
    } catch (error) {
      setError(getErrorMessage(error));
      if (error === "entry not found") {
        snackbar.error("Email tidak ditemukan");
      } else if (error === "Request failed with status code 500") {
        snackbar.error("Email tidak valid");
      } else {
        snackbar.error(error);
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className={style["forgot-password"]}>
      <form onSubmit={onSubmitHandler} id="reset-password-form">
        <Dialog
          className={style.dialog}
          visible={open}
          onCancel={onCancelHandler}
          primaryButton={{
            text: successSendEmail ? "Ok, Mengerti" : "Konfirmasi",
            onClick: successSendEmail ? onCancelHandler : () => {},
          }}
          secondaryButton={
            !successSendEmail
              ? {
                  text: "Batalkan",
                  onClick: onCancelHandler,
                }
              : ""
          }
        >
          <div className={style.content}>
            <div id="alert-dialog-description">
              {successSendEmail ? (
                <div className={style["content-container"]}>
                  <h1>Link Berhasil Terkirim!</h1>
                  <p>
                    Kami telah mengirim link ke{" "}
                    <span style={{ color: "#2196F3" }}>{email}</span>
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
                      value={email}
                      hintText={error}
                      action={error ? "error" : ""}
                      handleChange={(e) => setEmail(e.target.value)}
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
          {isSendingEmail ? <Loading /> : ""}
        </Dialog>
      </form>
    </div>
  );
};

export default ForgotPassword;
