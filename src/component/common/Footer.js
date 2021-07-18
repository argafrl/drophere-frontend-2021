import React from 'react';
import style from '../../css/footer.module.scss';

export default ({ right }) => {
  return (
    <div className={style.footer}>
      <p>Copyright &copy; 2021 <a
        rel="noopener noreferrer"
        target="_blank"
        href="http://bcc.filkom.ub.ac.id/"
        className="footer-link"
      >Basic Computing Community</a>. All rights reserved</p>
    </div>
  );
}