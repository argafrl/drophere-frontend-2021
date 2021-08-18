import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@bccfilkom/designsystem/build";
import style from "../../css/verify.module.scss";

const Verify = () => {
  return (
    <div className={style["container"]}>
      <img src="/img/not-found-old.png" alt="not-found" />
      <h2>Email Terverifikasi!</h2>
      <p>
        Selamat! email anda telah berhasil diverifikasi. Silahkan kembali ke beranda.
      </p>
      <Link to="/">
        <Button>
          Kembali ke beranda
        </Button>
      </Link>
  </div>
  );
}
 
export default Verify;