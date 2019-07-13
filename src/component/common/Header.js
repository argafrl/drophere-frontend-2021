import React from 'react';
import { Link } from 'react-router-dom';
import style from '../../css/account-header.module.scss';

export default function Header() {
  return (
    <div className={style.container + ' wrapper'}>
      <Link to="/">
        <img src="/img/bcc-logo-vertical-fit.png" alt="BCC LOGO" />
        <h1 className="title">DROP HERE</h1>
      </Link>
    </div>
  );
}
