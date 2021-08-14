import { Button, Dialog } from "@bccfilkom/designsystem/build";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { StorageContext } from "../../../contexts/StorageContext";
import { UserContext } from "../../../contexts/UserContext";
import style from "../../../css/account-connect.module.scss";
import { Portal } from "react-portal";

const ConnectAccount = () => {
  const { connectGoogleDrive, getOAuthUrl, isFetchingOAuthUrl } =
    useContext(StorageContext);
  const { fetchUserInfo, userInfo, isFetchingUserInfo } =
    useContext(UserContext);

  const [useDrive, setUseDrive] = useState(false);
  const [confirmModalShown, showConfirmModal] = useState(false);

  const { search } = useLocation();
  const history = useHistory();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const state = query.get("state");
    const code = query.get("code");
    const scope = query.get("scope");
    if (state && code && scope) {
      handleOauthUrlResponse({ state, code, scope });
    }
    if (!userInfo) {
      fetchUserInfo();
    } else {
      setUseDrive(userInfo.is_drive_connected);
    }
  }, [search, connectGoogleDrive, fetchUserInfo, userInfo]);

  const openGoogleConsentScreen = async () => {
    const { is_success, data } = await getOAuthUrl();
    if (is_success) {
      window.location.replace(data);
    } else {
    }
  };

  const handleNextPage = () => {
    if (useDrive) {
      history.push("/account");
    } else {
      showConfirmModal(true);
    }
  };

  const handleOauthUrlResponse = async (body) => {
    const data = await connectGoogleDrive(body);
    if (data && data.is_success) {
      console.log("success connect to drive");
      setUseDrive(true);
    }
  };

  const handleConnectDrive = () => {
    if (useDrive) {
      setUseDrive(false);
    } else {
      openGoogleConsentScreen();
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
            <Button
              className={useDrive ? style["button-cancel"] : ""}
              onClick={handleConnectDrive}
              skeleton={isFetchingUserInfo}
            >
              {useDrive ? "Batalkan" : "Tautkan"}
            </Button>
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
        <Button
          type="secondary"
          disabled={isFetchingUserInfo}
          onClick={handleNextPage}
        >
          Lanjutkan
        </Button>
      </div>
      <Portal>
        <div class={style["dialog"]}>
          <Dialog
            visible={confirmModalShown}
            onCancel={() => showConfirmModal(false)}
            primaryButton={{
              text: "Lanjutkan",
              onClick: () => history.push("/account"),
            }}
            secondaryButton={{
              text: "Kembali",
              onClick: () => showConfirmModal(false),
            }}
            title="Anda Belum Menautkan Akun"
          >
            Anda tetap harus menautkan akun ke cloud storage agar dapat membuat
            halaman. Yakin untuk melanjutkan?
          </Dialog>
        </div>
      </Portal>
    </div>
  );
};

export default ConnectAccount;
