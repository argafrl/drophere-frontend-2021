import React, { Component } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

import Profile from "./Profile";
import Pages from "./Pages";
import Support from "./Support";
import Storage from "./Storage";
import style from "../../../css/account-content.module.scss";
import menuStyle from "../../../css/menu.module.scss";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ConnectAccount from "../Home/ConnectAccount";
import { Button } from "@bccfilkom/designsystem/build";
import AddNewPage from "./AddNewPage";
import EditPage from "./EditPage";
import Authorization from "./Authorization";

function MenuItem(props) {
  return (
    <ListItem
      className={menuStyle["list-item"]}
      button
      selected={props.selected}
      onClick={props.onClick}
      style={props.selected ? { backgroundColor: "#D9EDF7" } : {}}
    >
      {props.icon != null ? (
        <ListItemIcon className={menuStyle["list-item-icon"]}>
          <Icon
            style={props.selected ? { color: "#1A74A0" } : { color: "#C4C4C4" }}
          >
            {props.icon}
          </Icon>
        </ListItemIcon>
      ) : (
        ""
      )}
      <ListItemText
        className={menuStyle["list-item-text"]}
        primary={props.caption}
        style={props.selected ? { color: "#1A74A0" } : { color: "#C4C4C4" }}
      />
    </ListItem>
  );
}

function Menu(props) {
  const history = useHistory();

  const selectedIndex =
    typeof props.selectedIndex === "number" ? props.selectedIndex : -1;

  const data = Array.isArray(props.data) ? props.data : [];

  const menuOnClickHandler =
    typeof props.onClick === "function" ? props.onClick : () => {};
  const onClickHandler = (index) => {
    return (e) => {
      e.preventDefault();

      menuOnClickHandler({
        index,
        url: data[index].url,
      });
    };
  };

  return (
    <div className={menuStyle.container + " wrapper"}>
      <Button
        className={style["buat-halaman"]}
        onClick={() => history.push("/account/pages/add")}
      >
        <Icon className={style.icon}>add</Icon>Buat Halaman
      </Button>
      <List component="nav">
        {data.map((item, index) => (
          <MenuItem
            key={"menu_item" + index}
            onClick={onClickHandler(index)}
            icon={item.icon}
            caption={item.caption}
            selected={selectedIndex === index}
          />
        ))}
      </List>
    </div>
  );
}

class Content extends Component {
  menus = [
    { caption: "Halaman", icon: "description", url: "/pages" },
    { caption: "Tautan Penyimpanan", icon: "link", url: "/storage" },
    { caption: "Masukan", icon: "comment", url: "/support" },
    { caption: "Profile", icon: "person_outline", url: "/profile" },
  ];

  constructor(props) {
    super(props);
    this.elementRef = React.createRef();
  }

  getSelectedMenuIndex = () => {
    const { match, location } = this.props;

    return this.menus.findIndex((v) => {
      return location.pathname.search(`${match.path}${v.url}`) >= 0;
    });
  };

  onClickHandler = ({ index, url }) => {
    const { match, history } = this.props;

    let loc = "";
    if (match) {
      loc = match.path + url;

      if (history) {
        history.push(loc);
      }
    }
  };

  render() {
    return (
      <div ref={this.elementRef} className={style.container + " wrapper"}>
        <div className={style.menu} id="mymenu">
          <Menu
            data={this.menus}
            selectedIndex={this.getSelectedMenuIndex()}
            onClick={this.onClickHandler}
          />
        </div>

        <div className={style.content}>
          <Switch>
            <Redirect from="/account" exact to="/account/pages" />
            <Route path="/account/pages" exact component={Pages} />
            <Route path="/account/pages/add" component={AddNewPage} />
            <Route path="/account/pages/:id/edit" component={EditPage} />
            <Route path="/account/profile" component={Profile} />
            <Route
              path="/account/storage/authorize"
              component={Authorization}
            />
            <Route path="/account/storage" component={Storage} />
            <Route path="/account/support" component={Support} />
            <Route path="/account/connect" component={ConnectAccount} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Content;
