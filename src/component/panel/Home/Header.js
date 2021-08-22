import React from "react";
import style from "../../../css/home-header.module.scss";

import LoginImage from "../../../assets/images/illustrations/login.webp";

export default function Header() {
  return (
    <div className={style.container}>
      <div className={style.top}>
        <img src={LoginImage} alt="HOME VECTOR" />
      </div>
      <div className={style.middle}>
        <h1>Kumpulkan Filemu di Sini!</h1>
        <p>Dapatkan kemudahan dalam mengunggah filemu</p>
      </div>
    </div>
  );
}
