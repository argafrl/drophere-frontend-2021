import React from "react";
import style from "../../../css/account-footer.module.scss";

import InstagramIcon from "../../../assets/images/icons/instagram.svg";
import LinkedinIcon from "../../../assets/images/icons/linkedin.svg";

const AccountFooter = () => {
  return (
    <div className={style.footer}>
      <div></div>
      <p>
        Copyright &copy; 2021 
        Basic Computing Community. 
        All rights reserved
      </p>
      <div className={style.logo}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/bccfilkom"
        >
          <img src={InstagramIcon} alt="BCC Instagram" />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://id.linkedin.com/company/bccfilkomub"
        >
          <img src={LinkedinIcon} alt="BCC LinkedIn" />
        </a>
      </div>
    </div>
  );
};

export default AccountFooter;
