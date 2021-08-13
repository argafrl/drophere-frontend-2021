import React, { Component } from "react";
import mainApi from "../../../api/mainApi";
import SupportStore from "../../../contexts/SupportContext";
import style from "../../../css/account.module.scss";
import Content from "./Content";

export default class Account extends Component {
  componentWillMount() {
    mainApi.defaults.headers.post["Content-Type"] = "application/json";
    mainApi.defaults.headers.common["Authorization"] =
      localStorage.getItem("bccdrophere_token");
  }

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
