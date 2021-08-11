import React, { Component } from "react";
import axios from "axios";

import { TokenContext } from "../../../contexts/token";

import style from "../../../css/account.module.scss";

import Content from "./Content";
import mainApi from "../../../api/mainApi";

export default class Account extends Component {
  static contextType = TokenContext;

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
