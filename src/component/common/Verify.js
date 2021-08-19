import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Preloader from "../common/Preloader";

import { Button } from "@bccfilkom/designsystem/build";
import style from "../../css/verify.module.scss";
import mainApi from "../../api/mainApi";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { getErrorMessage } from "../../helpers";
import { UserContext } from "../../contexts/UserContext";

const Verify = () => {
  const { search } = useLocation();
  const { logout } = useContext(UserContext);
  const snackbar = useContext(SnackbarContext);
  const history = useHistory();

  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);

  const verifyAccount = async (token) => {
    try {
      setIsVerifyingAccount(true);
      await mainApi.get(`/verify?verificationToken=${token}`);
    } catch (error) {
      snackbar.error(getErrorMessage(error));
      history.push("/");
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(search);
    const verificationToken = query.get("verificationToken");
    if (verificationToken) {
      verifyAccount(verificationToken);
    } else {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style["container"]}>
      {isVerifyingAccount ? (
        <Preloader />
      ) : (
        <>
          <img src="/img/not-found-old.png" alt="not-found" />
          <h2>Email Terverifikasi!</h2>
          <p>
            Selamat! email anda telah berhasil diverifikasi. Silahkan kembali ke
            beranda.
          </p>
          <Link to="/">
            <Button onClick={() => logout()}>Kembali ke beranda</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Verify;
