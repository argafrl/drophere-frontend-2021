import React, { useState } from "react";
import { Menu } from "@bccfilkom/designsystem/build";
import style from "../../../css/page-item.module.scss";

const PageCard = ({ title, date, views }) => {
  const [isClosed, setIsClosed] = useState("");
  const [isClosedBinary, setIsClosedBinary] = useState(true);

  const setOpenMenu = (closing, binary) => {
    setIsClosed(closing);
    setIsClosedBinary(binary);
  };

  const setCloseMenu = () => {
    setIsClosed(false);
    setIsClosedBinary(true);
  };

  return (
    <div className={style["item"]}>
      <div className={style.body}>
        <div className={style.top}>
          <img src="/img/icons/dropbox-active.svg" alt="dropbox-active" />
          <div className={style.menu}>
            {isClosed === 1 && (
              <Menu opened={isClosedBinary}>
                <Menu.Item
                  name="Edit halaman"
                  onClick={() => setCloseMenu(true)}
                />
                <Menu.Item
                  name="Salin link"
                  onClick={() => setCloseMenu(true)}
                />
                <Menu.Item name="Hapus" onClick={() => setCloseMenu(true)} />
              </Menu>
            )}
          </div>
          <div
            className={style["kebab-menu"]}
            style={{ display: "inline-block" }}
          >
            <button
              value={1}
              onClick={() => setOpenMenu(1, !isClosedBinary)}
            ></button>
          </div>
        </div>
        <div className={style.bottom}>
          <div className={style.title}>
            <p>{title}</p>
          </div>
          <div className={style.files}>
            <img src="/img/icons/folder.svg" alt="folder" />
            <p>25 files</p>
          </div>
        </div>
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
};

export default PageCard;
