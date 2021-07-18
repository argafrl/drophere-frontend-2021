import React from 'react';
import style from '../../../css/home-header.module.scss';

export default function Header() {
  return (
    <div className={style.container}>
      <div className={style.top}>
        <img src="/img/home-vector.png" alt="HOME VECTOR" />
      </div>
      <div className={style.middle}>
        {/* <p>Sebuah fasilitas untuk mengunggah file yang terintegrasi dengan cloud storage Dropbox dan Google Drive</p> */}
        <h1>Kumpulkan Filemu di Sini!</h1>
        <p>Dapatkan kemudahan dalam mengunggah filemu</p>
      </div>
      {/* <div className={style.bottom}>
        <img src="/img/dropbox-logo-sm.png" alt="BCC LOGO" />
        <img src="/img/google-drive-logo-sm.png" alt="BCC LOGO" />
      </div> */}
    </div>
  );
}
