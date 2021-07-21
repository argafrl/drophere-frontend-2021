import { Button } from "@bccfilkom/designsystem/build";
import React from "react";
import style from "../../../css/account-connect.module.scss";

const ConnectAccount = () => {
  return (
    <div className={style["container"]}>
      <div className={style["title-container"]}>
        <h1>Tautkan Akun Anda Sekarang!</h1>
        <p>Integrasikan akun anda dengan cloud storage Dropbox </p>
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
            <Button>Tautkan Akun</Button>
          </div>
        </div>
        <div className={style["card"]}>
          <div className={style["card__img"]}>
            <img src="/img/icons/drive-inactive.svg" alt="drive" />
          </div>
          <div className={style["card__body"]}>
            <h3
              className={
                style["card__body__title"] +
                " " +
                style["card__body__title-disabled"]
              }
            >
              Google Drive
            </h3>
            <p
              className={
                style["card__body__description"] +
                " " +
                style["card__body__description-disabled"]
              }
            >
              Tautkan akun ke Google Drive untuk menyimpan file
            </p>
            <Button type="secondary" disabled>
              Tautkan Akun
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccount;
