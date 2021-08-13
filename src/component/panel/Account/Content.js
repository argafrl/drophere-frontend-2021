import React, { Component, useContext } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

import Profile from "./Profile";
import Support from "./Support";
import Storage from "./Storage";
import style from "../../../css/account-content.module.scss";
import menuStyle from "../../../css/menu.module.scss";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@bccfilkom/designsystem/build";
import AddNewPage from "./AddNewPage";
import EditPage from "./EditPage";
import Authorization from "./Authorization";
import { SidebarContext } from "../../../contexts/SidebarContext";
import { UserContext } from "../../../contexts/UserContext";
import PagesNew from "./PagesNew";

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
        <ListItemIcon
          className={props.caption === "Logout" ? menuStyle["btn-logout"] : ""}
        >
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
        className={props.caption === "Logout" ? menuStyle["btn-logout"] : ""}
        primary={props.caption}
        style={props.selected ? { color: "#1A74A0" } : { color: "#C4C4C4" }}
      />
    </ListItem>
  );
}

const Menu = (props) => {
  const history = useHistory();
  const { closeSidebar } = useContext(SidebarContext);
  const { isFetchingUserInfo, userInfo, logout } = useContext(UserContext);

  const selectedIndex =
    typeof props.selectedIndex === "number" ? props.selectedIndex : -1;

  const data = Array.isArray(props.data) ? props.data : [];

  const menuOnClickHandler =
    typeof props.onClick === "function" ? props.onClick : () => {};

  const onClickHandler = (index) => {
    menuOnClickHandler({
      index,
      url: data[index].url,
    });
  };

  return (
    <div className={menuStyle.container + " wrapper"}>
      <div className={menuStyle["user"]}>
        <img src="/img/user.png" alt="user-profile" />
        <p>
          Hi,{" "}
          <strong>
            {isFetchingUserInfo || !userInfo
              ? "Loading..."
              : userInfo.full_name}
          </strong>
        </p>
      </div>
      <Button
        className={style["buat-halaman"]}
        onClick={() => {
          history.push("/account/pages/add");
          closeSidebar();
        }}
      >
        <Icon className={style.icon}>add</Icon>Buat Halaman
      </Button>
      <List component="nav">
        {data.map((item, index) => (
          <MenuItem
            key={"menu_item" + index}
            onClick={() => {
              onClickHandler(index);
              closeSidebar();
              if (item.caption === "Logout") {
                logout();
              }
            }}
            icon={item.icon}
            caption={item.caption}
            selected={selectedIndex === index}
          />
        ))}
      </List>
    </div>
  );
};

class Content extends Component {
  static contextType = SidebarContext;

  menus = [
    { caption: "Halaman", icon: "description", url: "/pages" },
    { caption: "Tautan Penyimpanan", icon: "link", url: "/storage" },
    { caption: "Masukan", icon: "comment", url: "/support" },
    { caption: "Profile", icon: "person_outline", url: "/profile" },
    { caption: "Logout", icon: "logout", url: "/home" },
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

    this.context.closeSidebar();
  };

  componentDidMount() {
    console.log(this.context);
  }

  render() {
    return (
      <div ref={this.elementRef} className={style.container + " wrapper"}>
        <div
          className={style.menu}
          id="mymenu"
          style={{ left: this.context.isSidebarOpen ? "0%" : "-100%" }}
        >
          <Menu
            data={this.menus}
            selectedIndex={this.getSelectedMenuIndex()}
            onClick={this.onClickHandler}
          />
        </div>

        <div className={style.content}>
          <Switch>
            <Redirect from="/account" exact to="/account/pages" />
            <Route path="/account/pages" exact component={PagesNew} />
            <Route path="/account/pages/add" component={AddNewPage} />
            <Route path="/account/pages/:id/edit" component={EditPage} />
            <Route path="/account/profile" component={Profile} />
            <Route
              path="/account/storage/authorize"
              component={Authorization}
            />
            <Route path="/account/storage" component={Storage} />
            <Route path="/account/support" component={Support} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Content;
