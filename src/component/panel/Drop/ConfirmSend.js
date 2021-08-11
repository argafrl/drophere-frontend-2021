import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { Button } from "@bccfilkom/designsystem/build";
import style from "../../../css/drop-confirm-send.module.scss";
import FileCard from "./FileCard";
import { PageContext } from "../../../contexts/PageContext";

const ConfirmSend = ({
  open,
  onClose,
  files = [],
  emptyFiles,
  formatBytes,
}) => {
  const {
    uploadProgress,
    uploadSubmission,
    isUploadingSubmission,
    successUploadSubmission,
    error,
    resetState,
    clearError,
  } = useContext(PageContext);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    clearError();
    setSubmitted(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("password", "123dev");
    uploadSubmission(formData);
  };

  useEffect(() => {
    if (successUploadSubmission) {
      console.log("success upload");
    }
  }, [successUploadSubmission]);

  return (
    <Dialog open={open} className={style["dialog"]}>
      <div>
        <DialogContent className={style["dialog__content"]}>
          <h2 className={style["dialog__content__title"]}>
            {!successUploadSubmission
              ? !error
                ? "Kirimkan File?"
                : "Gagal Terkirim!"
              : "Berhasil Terkirim!"}
          </h2>
          <div className={style["dialog__content__files"]}>
            {files.map((file, i) => (
              <FileCard
                key={i}
                name={file.name}
                uploaded={uploadProgress}
                submitted={submitted}
                success={successUploadSubmission}
                error={error}
                size={formatBytes(file.size)}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions className={style["dialog__actions"]}>
          {!successUploadSubmission && (
            <Button
              className={style["btn-cancel"]}
              type="text"
              onClick={() => {
                onClose();
                setSubmitted(false);
                emptyFiles();
                resetState();
              }}
              disabled={isUploadingSubmission}
            >
              Batalkan
            </Button>
          )}
          {!successUploadSubmission && (
            <Button
              disabled={isUploadingSubmission}
              className={style["btn-send"]}
              type="primary"
              onClick={handleSubmit}
            >
              Kirim {error && " Ulang"}
            </Button>
          )}
          {successUploadSubmission && (
            <Button
              className={style["btn-send"]}
              type="primary"
              onClick={() => {
                onClose();
                emptyFiles();
                setSubmitted(false);
              }}
            >
              Tutup
            </Button>
          )}
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ConfirmSend;
