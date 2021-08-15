import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/id";
import { Menu } from "@bccfilkom/designsystem/build";
import style from "../../../css/page-card.module.scss";
import { useHistory } from "react-router";

const PageCard = ({ title, due_time, storage_type, id }) => {
  const wrapperRef = useRef();
  const history = useHistory();

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

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setCloseMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className={style["item"]}>
      <div className={style.body}>
        <div className={style.top}>
          <img
            src={
              storage_type === 1
                ? "/img/icons/drive-active.svg"
                : "/img/icons/dropbox-active.svg"
            }
            alt="dropbox-active"
          />
          <div className={style.menu}>
            {isClosed === 1 && (
              <Menu opened={isClosedBinary}>
                <Menu.Item
                  name="Edit halaman"
                  onClick={() => history.push(`/account/pages/${id}/edit`)}
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
            ref={wrapperRef}
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
          <p>{moment(due_time).format("L")}</p>
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
