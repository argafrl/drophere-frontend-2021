import React, { useContext, useEffect, useState } from "react";
import style from "../../../css/storage.module.scss";
import { Button } from "@bccfilkom/designsystem/build";
import { Helmet } from "react-helmet";
import { UserContext } from "../../../contexts/UserContext";

const Storage = () => {
  const [useDrive, setUseDrive] = useState(false);
  const { userInfo, isFetchingUserInfo } = useContext(UserContext);

  useEffect(() => {
    if (userInfo) {
      setUseDrive(userInfo.is_gdrive_connected);
    }
  }, [userInfo]);

  return (
    <div>
      <div className={style.container}>
        <Helmet>
          <title>Tautan Penyimpanan</title>
        </Helmet>
        <h1>Tautkan Akun Anda</h1>
        <p>Integrasikan akun anda dengan Cloud Storage</p>
        <div className={style["card-container"]}>
          <div className={style["card"]}>
            <div className={style["card__body"]}>
              <h3 className={style["card__body__title"]}>Google Drive</h3>
              <p className={style["card__body__description"]}>
                Nantikan fitur baru untuk dapat terhubung ke Google Drive
              </p>
              {useDrive ? (
                <Button
                  className={style["button-cancel"]}
                  skeleton={isFetchingUserInfo}
                  disabled={useDrive}
                >
                  Batalkan{" "}
                </Button>
              ) : (
                <Button skeleton={isFetchingUserInfo}>Tautkan Akun</Button>
              )}
            </div>
            <div className={style["card__img"]}>
              <img src="/img/icons/drive-active.svg" alt="drive" />
            </div>
          </div>
          <div className={style["card"]}>
            <div className={style["card__body"]}>
              <h3 className={style["card__body__title"]}>Dropbox</h3>
              <p className={style["card__body__description"]}>
                Tautkan akun ke Dropbox untuk menyimpan file
              </p>
              <div className={style["card__body__badge"]}>Coming Soon</div>
            </div>
            <div className={style["card__img"]}>
              <img src="/img/icons/dropbox-active.svg" alt="dropbox" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
