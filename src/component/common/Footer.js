import React from "react";
import { Link } from "react-router-dom";
import style from "../../css/footer.module.scss";

import PrimaryLogo from "../../assets/images/primary-logo.webp";
import BCCLogo from "../../assets/images/BCC-logo.webp";
import GojekLogo from "../../assets/images/gojek-logo.webp";

import InstagramIcon from "../../assets/images/icons/instagram.svg";
import LinkedinIcon from "../../assets/images/icons/linkedin.svg";

export default () => {
  return (
    <div className={style.footer}>
      <div className={style.wrapper}>
        <div className={style["top"]}>
          <div className={style["drophere-wrapper"]}>
            <img src={PrimaryLogo} alt="Drophere Logo" />
          </div>
          <div className={style["drophere-description"]}>
            <p>
              BCC Drophere merupakan sebuah fasilitas untuk mengunggah file yang
              terintegrasi dengan cloud storage Dropbox dan Google Drive
            </p>
          </div>
          <div className={style["bcc-gojek-wrapper"]}>
            <div className={style["bcc-wrapper"]}>
              <h6>Developed by</h6>
              <a
                href="http://bccfilkom.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={BCCLogo} alt="BCC Logo" />
              </a>
            </div>
            <div className={style["gojek-wrapper"]}>
              <h6>Official Learning Partner</h6>
              <a
                href="https://www.gojek.com/en-id/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={GojekLogo} alt="Gojek Logo" />
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
            <a href="mailto:bcc.filkom@gmail.com">Hubungi Kami</a>
          </div>
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
      </div>
    </div>
  );
};
