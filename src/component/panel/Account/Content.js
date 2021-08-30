import React, { Component, useContext, useEffect, useState } from "react";
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

import Pages from "./Pages";
import AddNewPage from "./AddNewPage";
import EditPage from "./EditPage";

import { SidebarContext } from "../../../contexts/SidebarContext";
import { UserContext } from "../../../contexts/UserContext";
import AccountFooter from "./AccountFooter";

import DummyUser from "../../../assets/images/user.webp";
import { Avatar } from "@material-ui/core";

function MenuItem(props) {
  return (
    <div className={props.caption === "Keluar" ? menuStyle["btn-logout"] : ""}>
      <ListItem
        className={menuStyle["list-item"]}
        button
        selected={props.selected}
        onClick={props.onClick}
        style={props.selected ? { backgroundColor: "#D9EDF7" } : {}}
      >
        <div className={menuStyle["list-wrapper"]}>
          {props.icon != null ? (
            <ListItemIcon>
              <Icon
                style={
                  props.selected ? { color: "#1A74A0" } : { color: "black" }
                }
              >
                {props.icon}
              </Icon>
            </ListItemIcon>
          ) : (
            ""
          )}
          <ListItemText
            primary={props.caption}
            style={props.selected ? { color: "#1A74A0" } : { color: "black" }}
          />
        </div>
      </ListItem>
    </div>
  );
}

const Menu = (props) => {
  const history = useHistory();
  const { closeSidebar } = useContext(SidebarContext);
  const { isFetchingUserInfo, userInfo, logout } = useContext(UserContext);

  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.full_name);
      setProfileImage(userInfo.profile_image);
    }
  }, [userInfo]);

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
        <Avatar
          alt={name}
          className={menuStyle.avatar}
          src={"http://bcc-drophere-devel.ap-southeast-1.elasticbeanstalk.com/" + profileImage}
        />
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
              if (item.caption === "Keluar") {
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
    { caption: "Profil", icon: "person_outline", url: "/profile" },
    { caption: "Keluar", icon: "logout", url: "/home" },
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

  render() {
    return (
      <div className={style.body}>
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
              <Route path="/account/pages" exact component={Pages} />
              <Route path="/account/pages/add" exact component={AddNewPage} />
              <Route
                path="/account/pages/:slug/edit"
                exact
                component={EditPage}
              />
              <Route path="/account/profile" exact component={Profile} />
              <Route path="/account/storage" exact component={Storage} />
              <Route path="/account/support" exact component={Support} />
              <Redirect from="*" to="/not-found" />
            </Switch>
          </div>
        </div>
        <AccountFooter />
      </div>
    );
  }
}

export default Content;
