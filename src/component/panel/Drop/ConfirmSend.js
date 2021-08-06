import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { Button } from "@bccfilkom/designsystem/build";
import style from "../../../css/drop-confirm-send.module.scss";
import FileCard from "./FileCard";

const ConfirmSend = ({ open, onClose, files = [], emptyFiles }) => {
  const [submitted, setSubmitted] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const timer = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setInterval(() => {
      setUploaded((prev) => (prev += 0.1 * files[0].size));
    }, 1000);
  };

  useEffect(() => {
    if (files.length > 0 && uploaded >= files[0].size) {
      clearInterval(timer.current);
      onClose();
      emptyFiles();
    }
  }, [uploaded]);

  return (
    <Dialog open={open} onClose={onClose} className={style["dialog"]}>
      <form>
        <DialogContent className={style["dialog__content"]}>
          <h2 className={style["dialog__content__title"]}>Kirimkan File?</h2>
          <div className={style["dialog__content__files"]}>
            {files.map((file, i) => (
              <FileCard
                key={i}
                name={file.name}
                size={file.size}
                uploaded={uploaded}
                submitted={submitted}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions className={style["dialog__actions"]}>
          <Button
            className={style["btn-cancel"]}
            type="text"
            onClick={onClose}
            disabled={submitted}
          >
            Batalkan
          </Button>
          <Button
            disabled={submitted}
            className={style["btn-send"]}
            type="primary"
            onClick={handleSubmit}
          >
            Kirim
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ConfirmSend;
