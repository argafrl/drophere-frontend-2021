import React, { Component } from "react";
import axios from "axios";

import { TokenContext } from "../../../contexts/token";

import style from "../../../css/account.module.scss";

import Content from "./Content";

export default class Account extends Component {
  static contextType = TokenContext;

  componentWillMount() {
    axios.defaults.headers.post["Content-Type"] = "application/json";
    const currentToken = localStorage.getItem("bccdrophere_token");
    if (currentToken != null && currentToken.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
    }
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
