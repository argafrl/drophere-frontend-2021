import React from 'react';
import style from "../../../css/account-footer.module.scss";

const AccountFooter = () => {
  return (
    <div className={style.footer}>
      <div></div>
      <p>Copyright &copy; 2021 <a
        rel="noopener noreferrer"
        target="_blank"
        href="http://bcc.filkom.ub.ac.id/"
        className="footer-link"
      >Basic Computing Community</a>. All rights reserved</p>
      <div className={style.logo}>
        <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/bccfilkom">
          <img src="/img/instagram.svg" alt="BCC Instagram"/>
        </a>
        <a target="_blank" rel="noopener noreferrer" href="https://id.linkedin.com/company/bccfilkomub">
          <img src="/img/linkedin.svg" alt="BCC LinkedIn" />
        </a>
      </div>
    </div>
  );
}
 
export default AccountFooter;