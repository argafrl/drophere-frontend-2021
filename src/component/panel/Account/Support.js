import React, { useContext, useState } from "react";
import style from "../../../css/account-support.module.scss";
import { TextArea, Button } from "@bccfilkom/designsystem/build";
import { SupportContext } from "../../../contexts/SupportContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { Helmet } from "react-helmet";

export default function Support() {
  const [message, setMessage] = useState("");
  const { isPostingFeedback, postFeedback } = useContext(SupportContext);
  const snackbar = useContext(SnackbarContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!message) {
      snackbar.error("Mohon Periksa Inputan Anda");
      return;
    }
    postFeedback(message);
    setMessage("")
  };

  return (
    <div className={style.container + " opening-transition"}>
      <Helmet>
          <title>Masukan</title>
      </Helmet>
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
