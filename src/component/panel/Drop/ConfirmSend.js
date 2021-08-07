import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { Button } from "@bccfilkom/designsystem/build";
import style from "../../../css/drop-confirm-send.module.scss";
import FileCard from "./FileCard";

const ConfirmSend = ({ open, onClose, files = [], emptyFiles }) => {
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  // const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploaded(0);
    setSubmitted(true);
    setError("");
    timer.current = setInterval(() => {
      if (uploaded <= files[0].size) {
        setUploaded((prev) => (prev += 0.1 * files[0].size));
      }
    }, 1000);
  };

  useEffect(() => {
    if (files.length > 0 && uploaded >= files[0].size) {
      clearInterval(timer.current);
      setSuccess(true);
      // setError("error");
      // setSubmitted(false);
    }
  }, [uploaded, files]);

  return (
    <Dialog open={open} className={style["dialog"]}>
      <div>
        <DialogContent className={style["dialog__content"]}>
          <h2 className={style["dialog__content__title"]}>
            {!success
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
                size={file.size}
                uploaded={uploaded}
                submitted={submitted}
                success={success}
                error={error}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions className={style["dialog__actions"]}>
          {!success && (
            <Button
              className={style["btn-cancel"]}
              type="text"
              onClick={() => {
                onClose();
                setSubmitted(false);
                setSuccess(false);
                setError("");
                emptyFiles();
              }}
              disabled={submitted}
            >
              Batalkan
            </Button>
          )}
          {!success && (
            <Button
              disabled={submitted}
              className={style["btn-send"]}
              type="primary"
              onClick={handleSubmit}
            >
              Kirim {error && " Ulang"}
            </Button>
          )}
          {success && (
            <Button
              className={style["btn-send"]}
              type="primary"
              onClick={() => {
                onClose();
                emptyFiles();
                setSubmitted(false);
                setSuccess(false);
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
