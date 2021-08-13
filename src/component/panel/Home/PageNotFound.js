import React from "react";
import { useLocation } from "react-router";

import style from "../../../css/pages-not-found.module.scss";

const PagesNotFound = () => {
  let location = useLocation();
  return ( 
    <div className={style.container}>
      <div className={style['illustration-wrapper']}>
        <img src="/img/not-found.png" alt="Pages Not Found" />
        <h1>Halaman Tidak Ditemukan</h1>
        <p>Halaman yang anda cari tidak ditemukan, mohon periksa kembali link halaman anda</p>
      </div>
    </div>
 );
}
 
export default PagesNotFound;