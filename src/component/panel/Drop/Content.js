import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@bccfilkom/designsystem/build";
import { useDropzone } from "react-dropzone";
import style from "../../../css/drop-content.module.scss";
import FileItem from "./FileItem";
import { useParams } from "react-router";
import Inaccessible from "./Inaccessible";
import ConfirmSend from "./ConfirmSend";

const Content = () => {
  const [files, setFiles] = useState([]);
  const { slug } = useParams();
  const [confirmModalShown, showConfirmModal] = useState(false);

  const onDrop = (receivedFiles) => {
    setFiles(() => receivedFiles);
  };

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
    multiple: false,
    onDropRejected: () => console.log("rejected"),
    accept: ".pdf",
  });

  const handleRemove = (deletedFile) => {
    setFiles(files.filter((file) => file !== deletedFile));
  };

  const emptyFiles = () => {
    setFiles([]);
  };

  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    border: files.length > 0 ? "none" : "2px dashed #41A4D5",
    borderRadius: "0.5rem",
    outline: "none",
    margin: "1rem 0",
    transition: "border .24s ease-in-out",
    minHeight: 280,
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "red",
  };

  const dropStyle = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept, files]
  );

  if (slug !== "found-link") {
    return <Inaccessible />;
  }

  return (
    <div className={style["wrapper"]}>
      <ConfirmSend
        open={confirmModalShown}
        onClose={() => showConfirmModal(false)}
        files={files}
        emptyFiles={emptyFiles}
      />
      <div className={style["page"]}>
        <h1>Judul Halaman</h1>
        <div className={style["page__description"]}>Deskripsi Halaman</div>
        <div className={style["page__deadline"]}>
          Halaman ini akan ditutup dalam <strong>2 hari</strong>
        </div>
      </div>
      <div className={style["container"]}>
        <div className={style["container-inner"]}>
          <Button type="secondary" onClick={open}>
            + Pilih File
          </Button>
          <div
            {...getRootProps({
              style: dropStyle,
              className: style["drop-container"],
            })}
          >
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <div className={style["file-container"]}>
                {files.map((file, i) => (
                  <FileItem
                    key={i}
                    name={file.name}
                    size={file.size}
                    onRemove={() => handleRemove(file)}
                  />
                ))}
              </div>
            ) : (
              <>
                <img
                  src="/img/cloud-upload.png"
                  alt="cloud"
                  className={style["cloud-icon"]}
                />
                <h2>Letakkan file anda disini</h2>
                <p>Mendukung format PDF, PNG, RAR</p>
              </>
            )}
          </div>
          <div className={style["btn-send"]}>
            <Button
              type="primary"
              onClick={() => showConfirmModal(true)}
              disabled={files.length === 0}
              icon="/img/icons/airplane.svg"
            >
              Kirim File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
