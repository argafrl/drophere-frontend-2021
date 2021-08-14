import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { Button, Input } from "@bccfilkom/designsystem/build";
import style from "../../../css/drop-confirm-send.module.scss";
import FileCard from "./FileCard";
import { PageContext } from "../../../contexts/PageContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { useParams } from "react-router";

const ConfirmSend = ({
  open,
  onClose,
  files = [],
  emptyFiles,
  formatBytes,
  hasPassword,
}) => {
  const {
    uploadProgress,
    uploadSubmission,
    isUploadingSubmission,
    successUploadSubmission,
    error,
    resetState,
  } = useContext(PageContext);
  const snackbar = useContext(SnackbarContext);
  const { slug } = useParams();

  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    resetState();
    setSubmitted(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("password", password);
    uploadSubmission(formData, slug);
  };

  useEffect(() => {
    if (successUploadSubmission) {
      snackbar.success("File berhasil diupload");
    }
  }, [successUploadSubmission, snackbar]);

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
          {hasPassword && !isUploadingSubmission && !successUploadSubmission && (
            <div className={style["dialog__content__password"]}>
              <label>Password</label>
              <Input
                value={password}
                required
                handleChange={(e) => setPassword(e.target.value)}
                action={error === "invalid password" ? "error" : ""}
                hintText={error === "invalid password" ? "Password Salah" : ""}
              />
            </div>
          )}
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
