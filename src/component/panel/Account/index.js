import React, { useMemo } from "react";
import mainApi from "../../../api/mainApi";
import style from "../../../css/account.module.scss";
import Content from "./Content";

const Account = (props) => {
  useMemo(() => {
    mainApi.defaults.headers.post["Content-Type"] = "application/json";
    mainApi.defaults.headers.common["Authorization"] =
      localStorage.getItem("bccdrophere_token");
  }, []);

  return (
    <div className={style.container}>
      <div className={style["content-wrapper"]}>
        <Content {...props} />
      </div>
    </div>
  );
};

export default Account;
