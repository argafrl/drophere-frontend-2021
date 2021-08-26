import React, { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/id";
import { Dialog, Menu } from "@bccfilkom/designsystem/build";
import style from "../../../css/page-card.module.scss";
import { useHistory } from "react-router-dom";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

import CalendarIcon from "../../../assets/images/icons/calendar.svg";
import ViewIcon from "../../../assets/images/icons/views.svg";
import DriveIcon from "../../../assets/images/icons/drive-active.svg";
import DropboxIcon from "../../../assets/images/icons/dropbox-active.svg";
import KebabIcon from "../../../assets/images/icons/kebab-menu.svg";
import FolderIcon from "../../../assets/images/icons/folder.svg";

const PageCard = ({
  title,
  slug,
  due_time,
  storage_type,
  files,
  views,
  onDelete,
}) => {
  const history = useHistory();
  const wrapperRef = useRef();
  const snackbar = useContext(SnackbarContext);

  const [isClosed, setIsClosed] = useState("");
  const [isClosedBinary, setIsClosedBinary] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const setOpenMenu = (closing, binary) => {
    setIsClosed(closing);
    setIsClosedBinary(binary);
  };

  const setCloseMenu = () => {
    setIsClosed(false);
    setIsClosedBinary(true);
  };

  const handleRedirect = () => {
    history.push(`/account/pages/${slug}/edit`);
  };

  const handleDelete = () => {
    onDelete();
    setCloseMenu();
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setCloseMenu();
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      window.location.origin.toString() + "/link/" + slug
    );
    setCloseMenu();
    snackbar.success("Link " + title + " disalin ke clipboard");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className={style["item"]} ref={wrapperRef}>
      <Dialog
        className={style.dialog}
        // title="Title"
        visible={openDialog}
        onCancel={() => setOpenDialog(false)}
        primaryButton={{
          text: "Hapus",
          onClick: () => handleDelete(),
        }}
        secondaryButton={{
          text: "Batal",
          onClick: () => setOpenDialog(false),
        }}
      >
        <div className={style.content}>
          <div className={style["content-container"]}>
            <h1>Hapus Halaman</h1>
            <p>
              Apakah anda yakin ingin menghapus halaman{" "}
              <span style={{ fontWeight: "600" }}>{title}</span>
              {" ?"} Halaman yang dihapus tidak akan dapat diakses kembali.
            </p>
          </div>
        </div>
      </Dialog>
      <div className={style.body}>
        <div className={style.top}>
          <div className={style.storage}>
            <img
              src={storage_type === 1 ? DriveIcon : DropboxIcon}
              alt="dropbox-active"
            />
          </div>

          <div className={style.menu}>
            {isClosed === 1 && (
              <Menu opened={isClosedBinary}>
                <Menu.Item
                  name="Edit halaman"
                  onClick={() => handleRedirect()}
                ></Menu.Item>
                <Menu.Item
                  name="Salin link"
                  onClick={() => handleCopyToClipboard()}
                />
                <Menu.Item name="Hapus" onClick={() => setOpenDialog(true)} />
              </Menu>
            )}
          </div>
          <div className={style["kebab-menu"]} style={{ display: "flex" }}>
            <button value={1} onClick={() => setOpenMenu(1, !isClosedBinary)}>
              <img src={KebabIcon} alt="kebab-menu" />
            </button>
          </div>
        </div>
        <div className={style.bottom}>
          <div className={style.title}>
            {title.length >= 40 ? (
              <p>{`${title.substring(0, 55)}`}</p>
            ) : (
              <p>{title}</p>
            )}
          </div>
          <div className={style.files}>
            <img src={FolderIcon} alt="folder" />
            <p>{files} files</p>
          </div>
        </div>
      </div>
      <div className={style.footer}>
        <div className={style.calendar}>
          <img src={CalendarIcon} alt="calendar" />
          <p>
            {moment(due_time).format("L") !== "Invalid date"
              ? moment(due_time).format("L")
              : "Tidak ada"}
          </p>
        </div>
        <div className={style.views}>
          <img src={ViewIcon} alt="views" />
          <p>{views} Views</p>
        </div>
      </div>
    </div>
  );
};

export default PageCard;
