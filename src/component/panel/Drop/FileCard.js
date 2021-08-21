import React from "react";
import style from "../../../css/drop-file-card.module.scss";
import { FILE_TYPES } from "../../../utils/utils";

const ProgressBar = ({ uploaded }) => {
  return (
    <div className={style["progress"]}>
      <div className={style["progress-wrapper"]}>
        <div
          className={style["progress__bar"]}
          style={{ width: `${uploaded}%` }}
        ></div>
      </div>

      <span className={style["progress__percentage"]}>{uploaded}%</span>
    </div>
  );
};

const FileCard = ({ name, size, uploaded, submitted, success, error }) => {
  const extPosition = Math.max(0, name.lastIndexOf(".")) || Infinity;
  const fileName = name.slice(0, extPosition);
  const fileExt = name.slice(extPosition + 1).toLowerCase();

  return (
    <div className={style["file-card"]}>
      <div
        className={style["file-card__icon"]}
        style={{
          backgroundColor: FILE_TYPES[fileExt]
            ? FILE_TYPES[fileExt].backgroundColor
            : "",
          color: FILE_TYPES[fileExt] ? FILE_TYPES[fileExt].color : "",
        }}
      >
        {fileExt}
      </div>
      <div className={style["file-card__detail"]}>
        <h4 className={style["file-card__detail__name"]}>{fileName}</h4>
        {submitted ? (
          <ProgressBar size={size} uploaded={uploaded} />
        ) : !success ? (
          !error ? (
            <h5>{size}</h5>
          ) : (
            <h5>Gagal, ingin kirim ulang?</h5>
          )
        ) : (
          <h5>Selesai</h5>
        )}
      </div>
    </div>
  );
};

export default FileCard;
