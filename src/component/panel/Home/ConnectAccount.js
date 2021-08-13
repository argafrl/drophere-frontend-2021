import { Button } from "@bccfilkom/designsystem/build";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { StorageContext } from "../../../contexts/StorageContext";
import style from "../../../css/account-connect.module.scss";

const ConnectAccount = () => {
  const [useDrive, setUseDrive] = useState(false);
  const { search } = useLocation();
  const history = useHistory();

  const { connectGoogleDrive, getOAuthUrl, isFetchingOAuthUrl } =
    useContext(StorageContext);

  // eslint-disable-next-line
  useEffect(async () => {
    const query = new URLSearchParams(search);
    const state = query.get("state");
    const code = query.get("code");
    const scope = query.get("scope");
    if (state && code && scope) {
      const data = await connectGoogleDrive({ state, code, scope });
      if (data && data.is_success) {
        console.log("success connect to drive");
        setUseDrive(true);
      }
    }
    // eslint-disable-next-line
  }, [search, connectGoogleDrive]);

  const openGoogleConsentScreen = async () => {
    const { is_success, data } = await getOAuthUrl();
    if (is_success) {
      window.location.replace(data);
    } else {
      console.log("object");
    }
  };

  const handleNextPage = () => {
    if (useDrive) {
      history.push("/account");
    } else {
      console.log("show continue page");
    }
  };

  return (
    <div className={style["container"]}>
      <div className={style["title-container"]}>
        <h1>Tautkan Akun Anda Sekarang!</h1>
        <p>Integrasikan akun anda dengan cloud storage </p>
      </div>
      <div className={style["card-container"]}>
        <div className={style["card"] + " " + style["card-active"]}>
          <div className={style["card__img"]}>
            <img src="/img/icons/dropbox-active.svg" alt="dropbox" />
          </div>
          <div className={style["card__body"]}>
            <h3 className={style["card__body__title"]}>Dropbox</h3>
            <p className={style["card__body__description"]}>
              Tautkan akun ke Dropbox untuk menyimpan file
            </p>
            {useDrive ? (
              <Button
                className={style["button-cancel"]}
                onClick={() => setUseDrive(false)}
              >
                Batalkan{" "}
              </Button>
            ) : (
              <Button onClick={openGoogleConsentScreen}>Tautkan </Button>
            )}
          </div>
        </div>
        <div className={style["card"]}>
          <div className={style["card__img"]}>
            <img src="/img/icons/drive-active.svg" alt="drive" />
          </div>
          <div className={style["card__body"]}>
            <h3 className={style["card__body__title"]}>Google Drive</h3>
            <p className={style["card__body__description"]}>
              Nantikan fitur baru untuk dapat terhubung ke Google Drive
            </p>
            <div className={style["card__body__badge"]}>Coming Soon</div>
          </div>
        </div>
      </div>
      <div className={style["button-container"]}>
        <Button type="secondary" onClick={handleNextPage}>
          Lanjutkan
        </Button>
      </div>
    </div>
  );
};

export default ConnectAccount;
