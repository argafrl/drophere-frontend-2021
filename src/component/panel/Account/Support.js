import React, { useState } from "react";

import style from "../../../css/account-support.module.scss";
import { TextArea, Button } from "@bccfilkom/designsystem/build";

export default function Support() {
  const [message, setMessage] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();

    setMessage("");
  };

  return (
    <div className={style.container + " opening-transition"}>
      <h1>Kirim Masukan</h1>
      <p>Masukan anda dapat membantu layanan kami agar lebih maksimal</p>
      <form onSubmit={onSubmitHandler}>
        <TextArea
          placeholder="Tulis masukan anda"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <Button size="large" type="submit">
          Kirim
        </Button>
      </form>
    </div>
  );
}
