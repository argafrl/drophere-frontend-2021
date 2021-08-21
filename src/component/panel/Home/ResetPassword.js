import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Portal } from "react-portal";
import { Helmet } from "react-helmet";
import Loading from "../../common/Loading";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { Card, Button, Password, Dialog } from "@bccfilkom/designsystem/build";
import style from "../../../css/login.module.scss";
import mainApi from "../../../api/mainApi";
import { getErrorMessage } from "../../../utils/functions";

const ResetPassword = () => {
  const history = useHistory();
  const snackbar = useContext(SnackbarContext);
  const { search } = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isShowNew, setIsShowNew] = useState(false);
  const [isShowRetype, setIsShowRetype] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !retypePassword) {
      snackbar.error("Password dan konfirmasi password tidak boleh kosong");
      return;
    }

    if (newPassword !== retypePassword) {
      snackbar.error("Password dan konfirmasi password harus sama");
      return;
    }

    resetPassword();
  };

  const resetPassword = async () => {
    try {
      setIsResettingPassword(true);
      await mainApi.post(`/users/forgot-password?email=${email}`, {
        token,
        password: newPassword,
      });
      setOpenDialog(!openDialog);
    } catch (error) {
      snackbar.error(getErrorMessage(error));
    } finally {
      setIsResettingPassword(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(search);
    const email = query.get("email");
    const verificationToken = query.get("verificationToken");

    if (email && verificationToken) {
      setEmail(email);
      setToken(verificationToken);
    } else {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.container}>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <Portal>
        <div className={style.dialog}>
          <Dialog
            visible={openDialog}
            onCancel={() => setOpenDialog(false)}
            primaryButton={{
              text: "Masuk",
              onClick: () => {
                history.replace("/");
              },
            }}
            secondaryButton={""}
          >
            <div className={style.content}>
              <div className={style["content-container"]}>
                <h1>Password Berhasil Diubah!</h1>
                <p>
                  Password anda telah diubah. Silahkan mencoba untuk masuk
                  kembali.
                </p>
              </div>
            </div>
          </Dialog>
        </div>
      </Portal>
      <Card className={style.form}>
        <div className={style.header}>
          <h1>Atur Ulang Password</h1>
          <p>Masukkan password baru anda.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={style["form-container"]}>
            <div className={style["input-wrapper"]}>
              <p>Password baru</p>
              <Password
                className={style["input"]}
                type="password"
                placeholder="Masukkan Password"
                required
                value={newPassword}
                handleChange={(e) => setNewPassword(e.target.value)}
                visibilityEye={isShowNew}
                handleShow={() => setIsShowNew(!isShowNew)}
                style={{ borderRadius: "6px" }}
              />
            </div>
            <div className={style["input-wrapper"]}>
              <p>Ulangi Password</p>
              <Password
                className={style["input"]}
                type="password"
                placeholder="Masukkan Password"
                required
                value={retypePassword}
                handleChange={(e) => setRetypePassword(e.target.value)}
                visibilityEye={isShowRetype}
                handleShow={() => setIsShowRetype(!isShowRetype)}
                style={{ borderRadius: "6px" }}
              />
            </div>
            <Button className={style["button-daftar"]}>Konfirmasi</Button>
          </div>
          {isResettingPassword ? <Loading /> : ""}
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
