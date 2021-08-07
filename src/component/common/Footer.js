import React from 'react';
import style from '../../css/footer.module.scss';

export default ({ right }) => {
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
          <img src="/img/instagram.png" alt="BCC Instagram"/>
        </a>
        <a target="_blank" rel="noopener noreferrer" href="https://id.linkedin.com/company/bccfilkomub">
          <img src="/img/linkedin.png" alt="BCC LinkedIn" />
        </a>
      </div>   
    </div>
  );
}