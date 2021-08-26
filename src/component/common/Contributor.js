import React from "react";
import style from "../../css/contributor.module.scss";
import { Button } from "@bccfilkom/designsystem/build";
import { Link } from "react-router-dom";

const Contributor = () => {

  const ContributorList = [
    {
      nama: "Robihamanto",
      role: "Product Owner",
      linkedin: "robihamanto",
      foto: "contributor-po-robi.jpg"
    },
    {
      nama: "Hanifa Putri Rahima",
      role: "Product Manager",
      linkedin: "hanifaputri",
      foto: "contributor-pm-hanifa.jpg"
    },
    {
      nama: "Rivo Dimas Prakasa",
      role: "Product Designer",
      linkedin: "rivo-dimas",
      foto: "contributor-pd-rivo.jpg"
    },
    {
      nama: "Della Akhidatul Izzah",
      role: "Graphic Designer",
      linkedin: "adellaiz",
      foto: "contributor-graphic-della.jpg"
    },
    {
      nama: "Gifary Dhimas Fadhillah",
      role: "Developer",
      linkedin: "gifarydhimas",
      foto: "contributor-developer-gifary.jpg"
    },
    {
      nama: "Yahya Sahaja",
      role: "Front End Developer",
      linkedin: "yahyasahaja",
      foto: "contributor-fe-yahya.jpeg"
    },
    {
      nama: "Muhammad Arga Farrel Arkaan",
      role: "Front End Developer",
      linkedin: "muhammad-arga",
      foto: "contributor-fe-arga.jpg"
    },
    {
      nama: "Alfonsus Avianto Chandrawan",
      role: "Front End Developer",
      linkedin: "alfonsus-avianto-chandrawan-680a271a6",
      foto: "contributor-fe-alfonsus.jpeg"
    },
    {
      nama: "Muhammad Wildan Aldiansyah",
      role: "Back End Developer",
      linkedin: "aldiwildan",
      foto: "contributor-be-aldi.jpg"
    },
    {
      nama: "Harun Ulum F",
      role: "Back End Developer",
      linkedin: "huf0813",
      foto: "contributor-be-harun.jpg"
    },
    {
      nama: "Ibrahim Z. Faruqi",
      role: "Back End Developer",
      linkedin: "izfaruqi",
      foto: "contributor-be-ibrahim.png"
    },
  ]

  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h1>Kontributor Kami</h1>
        <p>
          Profil kontributor yang terlibat dalam pengembangan website Drophere
        </p>
      </div>

      <div className={style["grid-container"]}>
        {ContributorList.map((contributor, idx) => {
          return (
            <div className={style["item"]} key={idx}>
              <div className={style.top}>
                <div className={style.avatar}>
                  <img src={`/img/${contributor.foto}`} alt="Contributor" />
                </div>
              </div>

              <div className={style.middle}>
                <div className={style.nama}>
                  <p>{contributor.nama}</p>
                </div>
                <div className={style.role}>
                  <p>{contributor.role}</p>
                </div>
              </div>

              <div className={style.bottom}>
                <div className={style.linkedin}>
                  <a
                    href={`https://www.linkedin.com/in/${contributor.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img alt="Drophere Logo" />
                    <p>{contributor.linkedin}</p>
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>
      <div className={style["btn-wrapper"]}>
        <Link to="/">
          <Button>Kembali ke beranda</Button>
        </Link>
      </div>
    </div>
  );
};

export default Contributor;
