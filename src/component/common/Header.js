import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Dialog } from "@bccfilkom/designsystem/build";
import style from "../../css/account-header.module.scss";
import { UserContext } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";

import PrimaryLogo from "../../assets/images/primary-logo.webp";
import LogoutIcon from "../../assets/images/icons/logout.svg";
import DummyUser from "../../assets/images/user.webp";
import { Avatar } from "@material-ui/core";

const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const {
    userInfo,
    fetchUserInfo,
    isFetchingUserInfo,
    isAuthenticated,
    logout,
  } = useContext(UserContext);

  const { toogleSidebar } = useContext(SidebarContext);

  const location = useLocation();

  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated, fetchUserInfo]);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.full_name);
      setProfileImage(userInfo.profile_image);
    }
  }, [userInfo]);

  return (
    <div className={style.container + " wrapper"}>
      <Link to="/">
        <img src={PrimaryLogo} alt="Drophere Logo" className={style["logo"]} />
      </Link>
      {location.pathname.includes("/account") && (
        <>
          {" "}
          <button className={style["burger"]} onClick={toogleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          {isAuthenticated && (
            <div className={style["auth"]}>
              <div className={style["user"]}>
                <Avatar
                  alt={name}
                  className={style.avatar}
                  src={"https://api-drophere.bccfilkom.net/" + profileImage}
                />
                <p>
                  Hi,{" "}
                  <strong>
                    {isFetchingUserInfo || !userInfo
                      ? "Loading..."
                      : userInfo.full_name}
                  </strong>
                </p>
              </div>
              <Button
                className={style["btn-logout"]}
                type="secondary"
                icon={LogoutIcon}
                onClick={() => setOpenDialog(true)}
              >
                Keluar
              </Button>

              <div className={style.dialog}>
                <Dialog
                  visible={openDialog}
                  onCancel={() => setOpenDialog(false)}
                  primaryButton={{
                    text: "Keluar",
                    onClick: () => {
                      logout();
                      setOpenDialog(false);
                    },
                  }}
                  secondaryButton={{
                    text: "Batalkan",
                    onClick: () => setOpenDialog(false),
                  }}
                >
                  <div className={style.content}>
                    <div className={style["content-container"]}>
                      <h1>Keluar Akun</h1>
                      <p>Apakah anda yakin akan keluar?</p>
                    </div>
                  </div>
                </Dialog>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
