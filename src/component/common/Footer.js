import React from "react";
import { Link } from "react-router-dom";
import style from "../../css/footer.module.scss";

export default () => {
  return (
    <div className={style.footer}>
      <div className={style.wrapper}>
        <div className={style["top"]}>
          <div className={style["drophere-wrapper"]}>
            <img src="/img/primary-logo.svg" alt="Drophere Logo" />
          </div>
          <div className={style["drophere-description"]}>
            <p>
              Drophere merupakan sebuah fasilitas untuk mengunggah file yang
              terintegrasi dengan cloud storage Dropbox dan Google Drive
            </p>
          </div>
          <div className={style["bcc-gojek-wrapper"]}>
            <div className={style["bcc-wrapper"]}>
              <h6>Developed by</h6>
              <a
                href="http://bcc.filkom.ub.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/img/BCC-logo.svg" alt="BCC Logo" />
              </a>
            </div>
            <div className={style["gojek-wrapper"]}>
              <h6>Official Learning Partner</h6>
              <a
                href="https://www.gojek.com/en-id/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/img/gojek-logo.svg" alt="Gojek Logo" />
              </a>
            </div>
          </div>
        </div>

        <div className={style["bottom"]}>
          <div className={style.copyright}>
            <p>
              Copyright &copy; 2021 Basic Computing Community. All rights
              reserved
            </p>
          </div>
          <div className={style.link}>
            <Link to="/contributor">Kontributor</Link>
            <Link>Hubungi Kami</Link>
          </div>
          <div className={style.logo}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/bccfilkom"
            >
              <img src="/img/instagram.svg" alt="BCC Instagram" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://id.linkedin.com/company/bccfilkomub"
            >
              <img src="/img/linkedin.svg" alt="BCC LinkedIn" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
