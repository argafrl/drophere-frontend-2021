import React, { Component } from "react";
import SupportStore from "../../../contexts/SupportContext";
import style from "../../../css/account.module.scss";
import Content from "./Content";

export default class Account extends Component {
  render() {
    return (
      <SupportStore>
        <div className={style.container}>
          <div className={style["content-wrapper"]}>
            <Content {...this.props} />
          </div>
        </div>
      </SupportStore>
    );
  }
}
