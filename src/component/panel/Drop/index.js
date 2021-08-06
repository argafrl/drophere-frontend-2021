import React from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import style from "../../../css/drop.module.scss";
import Content from "./Content";

const Drop = () => {
  return (
    <div className={style["wrapper"]}>
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default Drop;
