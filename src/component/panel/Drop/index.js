import React from "react";
import style from "../../../css/drop.module.scss";
import Footer from "../../common/Footer";
import Content from "./Content";

const Drop = () => {
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
