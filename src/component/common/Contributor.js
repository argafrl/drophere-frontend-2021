import React from 'react';
import style from '../../css/contributor.module.scss';
import { Button } from "@bccfilkom/designsystem/build";
import { Link } from 'react-router-dom';

const Contributor = () => {
  return (
    <div className={style.container}>
      <div className={style.heading}>
        <h1>Kontributor Kami</h1>
        <p>Profil kontributor yang terlibat dalam pengembangan website Drophere</p>
      </div>

      <div className={style['grid-container']}>
        { [...Array(10)].map( (e,i) => {
            return (
              <div className={style["item"]} key={i}>
                <div className={style["avatar"]} >
                  <img src="/img/user.png" alt="Drophere Logo" />
                </div>
                <div className={style.nama}>
                  <p>Hanifa Putri Rahima</p>
                </div>
                <div className={style.role}>
                  <p>Product Manager</p>
                </div>
                <div className={style.linkedin}>
                  <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                    {/* <img src="/img/linkedin-grey.svg" alt="Drophere Logo" /> */}
                    <img alt="Drophere Logo" />
                    <p>hanifaputri</p>
                  </a>
                </div>
              </div>
            );      
          }
        )}
      </div>
      <div className={style['btn-wrapper']}>
        <Link to='/'><Button>Kembali ke beranda</Button></Link>
      </div>
    </div>
  );
}
 
export default Contributor;