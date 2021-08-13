import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@bccfilkom/designsystem/build";
import style from "../../css/account-header.module.scss";
import { UserContext } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";

const Header = () => {
  const {
    userInfo,
    fetchUserInfo,
    isFetchingUserInfo,
    isAuthenticated,
    logout,
  } = useContext(UserContext);

  const { toogleSidebar } = useContext(SidebarContext);

  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated, fetchUserInfo]);

  return (
    <div className={style.container + " wrapper"}>
      <Link to="/">
        <img
          src="/img/primary-logo.svg"
          alt="Drophere Logo"
          className={style["logo"]}
        />
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
                <img src="/img/user.png" alt="user-profile" />
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
                type="secondary"
                icon="/img/icons/logout.svg"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
