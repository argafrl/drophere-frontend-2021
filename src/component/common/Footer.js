import React from 'react';
import style from '../../css/footer.module.scss';

export default ({ right }) => {
  return (
    <div className={style.footer}>
      {/* <div></div>
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
      </div>    */}
      <div className={style.wrapper}>
        <div className={style['top']}>
          <div className={style['left']}>
            <img
              src="/img/primary-logo.svg"
              alt="Drophere Logo"
              className={style["drophere-logo"]}
            />
            <p>Drophere merupakan sebuah fasilitas untuk mengunggah file yang
              terintegrasi dengan cloud storage Dropbox dan Google Drive
            </p>
          </div>
          <div className={style['right']}>
            <div className={style['item-1']}>
              <h6>
                Tentang
              </h6>
              <p>Kontributor</p>
            </div>
            <div className={style['item-2']}>
              <h6>
                Dikembangkan Oleh
              </h6>
              <img src="/img/bcc-logo.svg" alt="BCC Logo"/>
            </div>
            <div className={style['item-3']}>
              <h6>
                Official Learning Partner
              </h6>
              <img src="/img/gojek-logo.svg" alt="Gojek Logo"/>
            </div>
          </div>
        </div>

        <div className={style['bottom']}>
          <div className={style.copyright}>
            <p>Copyright &copy; 2021 
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="http://bcc.filkom.ub.ac.id/"
                className="footer-link"
                > Basic Computing Community
              </a>
              . All rights reserved
            </p>
          </div>
          <div className={style.logo}>
            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/bccfilkom">
              <img src="/img/instagram.png" alt="BCC Instagram"/>
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://id.linkedin.com/company/bccfilkomub">
              <img src="/img/linkedin.png" alt="BCC LinkedIn" />
            </a>
          </div> 
        </div>
      </div> 
    </div>
  );
}