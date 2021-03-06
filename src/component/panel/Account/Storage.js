import React, { useContext, useEffect, useState } from "react";
import style from "../../../css/storage.module.scss";
import { Button } from "@bccfilkom/designsystem/build";
import { Helmet } from "react-helmet";
import { UserContext } from "../../../contexts/UserContext";
import { useHistory } from "react-router";

import DriveIcon from "../../../assets/images/icons/drive-active.svg";
import DropboxIcon from "../../../assets/images/icons/dropbox-active.svg";

const Storage = () => {
  const [useDrive, setUseDrive] = useState(false);
  const { userInfo, isFetchingUserInfo } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (userInfo) {
      setUseDrive(userInfo.is_gdrive_connected);
    }
  }, [userInfo]);

  const handleConnectDrive = () => {
    if (!useDrive) {
      history.push("/connect-account");
    }
  };

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
                Tautkan akun ke Google Drive untuk menyimpan file
              </p>
              <Button
                className={useDrive ? style["button-cancel"] : ""}
                onClick={handleConnectDrive}
                skeleton={isFetchingUserInfo}
                disabled={useDrive || isFetchingUserInfo}
              >
                {useDrive ? "Batalkan" : "Tautkan"}
              </Button>
            </div>
            <div className={style["card__img"]}>
              <img src={DriveIcon} alt="drive" />
            </div>
          </div>
          <div className={style["card"]}>
            <div className={style["card__body"]}>
              <h3 className={style["card__body__title"]}>Dropbox</h3>
              <p className={style["card__body__description"]}>
                Nantikan fitur baru untuk dapat terhubung ke Dropbox
              </p>
              <div className={style["card__body__badge"]}>Coming Soon</div>
            </div>
            <div className={style["card__img"]}>
              <img src={DropboxIcon} alt="dropbox" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
