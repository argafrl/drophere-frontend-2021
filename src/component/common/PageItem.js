import React from "react";
import { useState } from "react";

import style from  '../../css/page-item.module.scss';

const PageItem = (props) => {

  // const [openKebab, setOpenKebab] = useState(false)
  
  const handleClickOpenKebab = props.handleClickOpenKebab;
  const openKebab = props.openKebab;

  // const handleClickOpenKebab = () => {
  //   setOpenKebab(!openKebab);
  // }

    return (
        <div className={style["item"]}>
            <div className={style.body}>
              <div className={style.top}>
                <img src="/img/icons/dropbox-active.svg" alt="dropbox-active" />
                <button onClick={handleClickOpenKebab}></button>
              </div> 
              <div className={style.bottom}>
                <div className={style.title}>
                  <p>Praktikum Dasar Basis Data</p>
                </div>
                <div className={style.files}>
                  <img src="/img/icons/folder.svg" alt="folder" />
                  <p>25 files</p>
                </div>
              </div>
              { openKebab ? 
              <div className={style['kebab-menu']}>
                <ul class="dropdown">
                  <li><a href="http://www.g.com">1</a></li>
                  <li><a href="http://www.g.com">2</a></li>
                  <li><a href="http://www.g.com">3</a></li>
                  <li><a href="http://www.g.com">4</a></li>
                </ul>
              </div>:
              <div>
                
              </div>
              }
            </div>
            <div className={style.footer}>
              <div className={style.calendar}>
                <img src="/img/icons/calendar.svg" alt="calendar" />
                <p>21 Jul 2021</p>
              </div>
              <div className={style.views}>
                <img src="/img/icons/views.svg" alt="views" />
                <p>40 Views</p>
              </div>
            </div>
          </div>
    );
}
 
export default PageItem;