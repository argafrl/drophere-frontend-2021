import React, { useEffect } from "react";
import style from "../../../css/drop-file-card.module.scss";
import { FILE_TYPES } from "../../../utils";

const ProgressBar = ({ size, uploaded }) => {
  let percentage = Math.round((uploaded / size) * 100);

  return (
    <div className={style["progress"]}>
      <div style={{ width: 240 }}>
        <div
          className={style["progress__bar"]}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <span className={style["progress__percentage"]}>{percentage}%</span>
    </div>
  );
};

const FileCard = ({ name, size, uploaded, submitted }) => {
  const extPosition = Math.max(0, name.lastIndexOf(".")) || Infinity;
  const fileName = name.slice(0, extPosition);
  const fileExt = name.slice(extPosition + 1);

  useEffect(() => {
    console.log(size);
  });

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
        ) : (
          <h5>{size} kb</h5>
        )}
      </div>
    </div>
  );
};

export default FileCard;
