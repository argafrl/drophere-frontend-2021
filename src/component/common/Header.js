import React from "react";
import { Link } from "react-router-dom";
import { Search, Button } from "@bccfilkom/designsystem/build";
import style from "../../css/account-header.module.scss";

export default function Header() {
  return (
    <div className={style.container + " wrapper"}>
      <Link to="/">
        <img src="/img/bcc-logo-horizontal.png" alt="BCC LOGO" />
        <h1>Drophere</h1>
      </Link>
      <div className={style["search-wrapper"]}>
        <Search placeholder="Telusuri" />
      </div>
      <div className={style["auth"]}>
        <div className={style["user"]}>
          <img src="/img/user.png" alt="user-profile" />
          <h3>Hi, Rivo</h3>
        </div>
        <Button type="secondary" icon="/img/icons/logout.svg">
          Logout
        </Button>
      </div>
    </div>
  );
}
