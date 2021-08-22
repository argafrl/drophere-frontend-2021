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
      foto: "user.png"
    },
    {
      nama: "Della Akhidatul Izzah",
      role: "Graphic Designer",
      linkedin: "adellaiz",
      foto: "contributor-graphic-della.jpg"
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
      foto: "contributor-fe-arga.png"
    },
    {
      nama: "Muhammad Wildan Aldiansyah",
      role: "Back End Developer",
      linkedin: "aldiwildan",
      foto: "user.png"
    },
    {
      nama: "Harun Ulum F",
      role: "Back End Developer",
      linkedin: "huf0813",
      foto: "contributor-be-harun.jpg"
    },
    {
      nama: "Gifary Dhimas Fadhillah",
      role: "Developer",
      linkedin: "gifarydhimas",
      foto: "user.png"
    }
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
                  <img src={`/img/${contributor.foto}`} alt="Drophere Logo" />
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
