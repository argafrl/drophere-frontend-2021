import React, { useContext, useState } from "react";
import style from "../../../css/account-support.module.scss";
import { TextArea, Button } from "@bccfilkom/designsystem/build";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { Helmet } from "react-helmet";
import mainApi from "../../../api/mainApi";
import { getErrorMessage } from "../../../utils/functions";

export default function Support() {
  const [message, setMessage] = useState("");
  const [isPostingFeedback, setIsPostingFeedback] = useState(false);

  const snackbar = useContext(SnackbarContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!message) {
      snackbar.error("Mohon Periksa Inputan Anda");
      return;
    }
    postFeedback(message);
  };

  const postFeedback = async (content) => {
    try {
      setIsPostingFeedback(true);
      await mainApi.post("/users/feedback", { content });
      snackbar.success("Feedback Berhasil Dikirim");
      setMessage("");
    } catch (error) {
      snackbar.error(getErrorMessage(error));
    } finally {
      setIsPostingFeedback(false);
    }
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
