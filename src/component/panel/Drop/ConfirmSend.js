import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { Button, Input } from "@bccfilkom/designsystem/build";
import style from "../../../css/drop-confirm-send.module.scss";
import FileCard from "./FileCard";
import { useParams } from "react-router";
import mainApi from "../../../api/mainApi";
import { getErrorMessage } from "../../../utils/functions";

const ConfirmSend = ({
  open,
  onClose,
  files = [],
  emptyFiles,
  formatBytes,
  hasPassword,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [isUploadingSubmission, setIsUploadingSubmission] = useState(false);
  const [successUploadSubmission, setSuccessUploadSubmission] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const { slug } = useParams();

  const handleSubmit = async () => {
    resetUploadState();
    setSubmitted(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("password", password);
    uploadSubmission(formData, slug);
  };

  const closeModal = () => {
    onClose();
    setSubmitted(false);
    emptyFiles();
    setPassword("");
    resetUploadState();
  };

  const uploadSubmission = async (formData) => {
    try {
      setIsUploadingSubmission(true);
      await mainApi.post(`/submissions/${slug}/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(percentCompleted);
        },
      });
      setSuccessUploadSubmission(true);
    } catch (error) {
      setError(getErrorMessage(error));
      setSuccessUploadSubmission(false);
    } finally {
      setIsUploadingSubmission(false);
    }
  };

  const resetUploadState = () => {
    setError("");
    setIsUploadingSubmission(false);
    setSuccessUploadSubmission(false);
    setUploadProgress(0);
  };

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
                placeholder='Masukkan password'
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
              onClick={closeModal}
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
              onClick={closeModal}
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
