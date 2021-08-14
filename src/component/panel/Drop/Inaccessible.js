import React from "react";
import style from "../../../css/drop-inaccessible-not-found.module.scss";

const Inaccessible = () => {
  return (
    <div className={style["container"]}>
      <img src="/img/lewat-tenggat.png" alt="overdue" />
      <h2>Maaf, Halaman Tidak Dapat Diakses</h2>
      <p>
        Halaman ini ditutup karena telah melewati batas waktu yang telah
        ditentukan
      </p>
    </div>
  );
};

export default Inaccessible;
