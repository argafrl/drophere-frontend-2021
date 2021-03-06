import React from "react";
import style from "../../../css/drop-file.module.scss";
import { FILE_TYPES } from "../../../utils/utils";

import CrossIcon from "../../../assets/images/icons/cross.svg";

const FileItem = ({ name, size, onRemove }) => {
  const extPosition = Math.max(0, name.lastIndexOf(".")) || Infinity;
  const fileName = name.slice(0, extPosition);
  const fileExt = name.slice(extPosition + 1).toLowerCase();

  return (
    <div className={style["file"]}>
      <div
        style={{
          backgroundColor: FILE_TYPES[fileExt]
            ? FILE_TYPES[fileExt].backgroundColor
            : "",
          color: FILE_TYPES[fileExt] ? FILE_TYPES[fileExt].color : "",
        }}
        className={style["file__icon"]}
      >
        <button onClick={onRemove}>
          <img src={CrossIcon} alt="remove" />
        </button>
        <h3>{fileExt}</h3>
      </div>
      <div className={style["file__info"]}>
        <h4>{fileName}</h4>
        <h5>{size}</h5>
      </div>
    </div>
  );
};

export default FileItem;
