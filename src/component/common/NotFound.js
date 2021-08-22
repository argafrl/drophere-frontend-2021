import React from "react";
import style from "../../css/drop-inaccessible-not-found.module.scss";

import NotFoundImage from "../../assets/images/illustrations/not-found.webp";

const NotFound = () => {
  return (
    <div className={style["container"]}>
      <img src={NotFoundImage} alt="not-found" />
      <h2>Halaman Tidak Ditemukan</h2>
      <p>
        Halaman yang anda cari tidak ditemukan, mohon periksa kembali link
        halaman anda
      </p>
    </div>
  );
};

export default NotFound;
