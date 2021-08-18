import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Portal } from "react-portal";
import { Helmet } from "react-helmet";

import Loading from "../../common/Loading";

import { UserContext } from "../../../contexts/UserContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

import { Card, Button, Input, Password, Dialog } from "@bccfilkom/designsystem/build";
import style from "../../../css/login.module.scss";

const ResetPasswordNew = () => {
  const { 
    updateForgotPassword, 
    isUpdatingForgotPassword, 
    successUpdatingForgotPassword, 
    errorUpdatingForgotPassword, 
    clearError, 
    isLogin, 
    userInfo, 
    fetchUserInfo, 
    clearUserInfo } = useContext(UserContext);

  const snackbar = useContext(SnackbarContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [isShowNew, setIsShowNew] = useState(false)
  const [isShowRetype, setIsShowRetype] = useState(false)

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const history = useHistory();

  const handleUpdateForgotPassword = async (e) => {
    e.preventDefault();
    clearError();
    // updateForgotPassword(token, email, newPassword)
  };

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
    } else {
      fetchUserInfo();
    }
    if (successUpdatingForgotPassword){
      snackbar.success("Profil berhasil diperbarui");
      clearUserInfo();
    }
    else if (errorUpdatingForgotPassword){
      snackbar.error(errorUpdatingForgotPassword)
    }
  }, [
    userInfo,
    successUpdatingForgotPassword,
  ])

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
                history.push('/');
              },
            }}
            secondaryButton={""}
          >
            <div className={style.content}>
              <div className={style["content-container"]}>
                <h1>Password Berhasil Diubah!</h1>
                <p>Password anda telah diubah. Silahkan mencoba untuk masuk kembali.</p>
              </div>
            </div>
          </Dialog>
        </div>
      </Portal>

      <Card className={style.form}>
        <div className={style.header}>
          <h1>Atur Ulang Password</h1>
          <p>
            Masukkan password baru anda.
          </p>
        </div>
        <form onSubmit={handleUpdateForgotPassword}>
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
            <Button className={style["button-daftar"]} onClick={() => setOpenDialog(!openDialog)}>Konfirmasi</Button>
          </div>
          { isUpdatingForgotPassword ? <Loading /> : "" }
        </form>
      </Card>
    </div>
  );
}
 
export default ResetPasswordNew;