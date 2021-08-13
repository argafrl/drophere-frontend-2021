import React from 'react';
import style from '../../../css/home-header.module.scss';

export default function Header() {
  return (
    <div className={style.container}>
      <div className={style.top}>
        <img src="/img/login.png" alt="HOME VECTOR" />
      </div>
      <div className={style.middle}>
        <h1>Kumpulkan Filemu di Sini!</h1>
        <p>Dapatkan kemudahan dalam mengunggah filemu</p>
      </div>
    </div>
  );
}
