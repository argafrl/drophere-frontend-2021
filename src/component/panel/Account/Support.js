import React, { useContext, useEffect, useState } from "react";
import style from "../../../css/account-support.module.scss";
import { TextArea, Button } from "@bccfilkom/designsystem/build";
import { SupportContext } from "../../../contexts/SupportContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

export default function Support() {
  const [message, setMessage] = useState("");
  const { error, success, isPostingFeedback, postFeedback, resetState } =
    useContext(SupportContext);
  const snackbar = useContext(SnackbarContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!message) {
      snackbar.error("Mohon Periksa Inputan Anda");
      return;
    }
    postFeedback(message);
  };

  useEffect(() => {
    if (error) {
      snackbar.error("Terjadi Kesalahan");
      resetState();
    }
    if (success) {
      setMessage("");
      resetState();
      snackbar.success("Masukan Berhasil Dikirim");
    }
  }, [success, resetState, error, snackbar]);

  return (
    <div className={style.container + " opening-transition"}>
      <h1>Kirim Masukan</h1>
      <p>Masukan anda dapat membantu layanan kami agar lebih maksimal</p>
      <form onSubmit={onSubmitHandler}>
        <TextArea
          placeholder="Tulis masukan anda"
          value={message}
          handleChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <Button size="large" type="submit" disabled={isPostingFeedback}>
          Kirim
        </Button>
      </form>
    </div>
  );
}
