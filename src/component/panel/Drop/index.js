import React, { useMemo } from "react";
import mainApi from "../../../api/mainApi";
import style from "../../../css/drop.module.scss";
import Footer from "../../common/Footer";
import Content from "./Content";

const Drop = () => {
  useMemo(() => {
    mainApi.defaults.headers.common["Authorization"] =
      localStorage.getItem("bccdrophere_token");
  }, []);

  return (
    <div className={style.container}>
      <div className={style.content}>
        <Content />
      </div>
      <div className={style.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default Drop;
