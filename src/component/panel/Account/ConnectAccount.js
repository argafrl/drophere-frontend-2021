import { Button } from "@bccfilkom/designsystem/build";
import React, { useState } from "react";
import style from "../../../css/account-connect.module.scss";

const ConnectAccount = () => {
  const [useDrive, setUseDrive] = useState(false);

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
              <Button onClick={() => setUseDrive(true)}>Tautkan </Button>
            )}
          </div>
        </div>
        <div className={style["card"]}>
          <div className={style["card__img"]}>
            <img src="/img/icons/drive-active.svg" alt="drive" />
          </div>
          <div className={style["card__body"]}>
            <div className={style["card__body__badge"]}>
              <span>Coming Soon</span>
            </div>
            <h3 className={style["card__body__title"]}>Google Drive</h3>
            <p className={style["card__body__description"]}>
              Nantikan fitur baru untuk dapat terhubung ke Google Drive
            </p>
          </div>
        </div>
      </div>
      <div className={style["button-container"]}>
        <Button type="secondary">Lanjutkan</Button>
      </div>
    </div>
  );
};

export default ConnectAccount;
