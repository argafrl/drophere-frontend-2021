import React from "react";
import style from "../../../css/drop-inaccessible-not-found.module.scss";

const NotFound = () => {
  return (
    <div className={style["container"]}>
      <img src="/img/not-found.png" alt="not-found" />
      <h2>Halaman Tidak Ditemukan</h2>
      <p>
        Halaman yang anda cari tidak ditemukan, mohon periksa kembali link
        halaman anda
      </p>
    </div>
  );
};

export default NotFound;
