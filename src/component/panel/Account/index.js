import React, { Component } from "react";
import mainApi from "../../../api/mainApi";
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
      <div className={style.container}>
        <div className={style["content-wrapper"]}>
          <Content {...this.props} />
        </div>
      </div>
    );
  }
}
