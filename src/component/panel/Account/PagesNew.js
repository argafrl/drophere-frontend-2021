import React, { Component, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import moment from "moment";
// import { useSnackbar } from "notistack";

import style from "../../../css/pages.module.scss";
// import editPageStyle from "../../../css/edit-page.module.scss";

import {
  // defaultStorageProviderId,
  // endpointURL,
  excludeSlug,
  // linkPrefix,
  // storageProviders,
} from "../../../config";

import Loading from "../../common/Loading";

import { Button, Dropdown, DropdownItem, Menu, Search, Dialog } from '@bccfilkom/designsystem/build';

// import {
//   Collapse,
//   // Dialog,
//   DialogActions, 
//   DialogContent, 
//   DialogContentText,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   Grid,
//   Icon,
//   Input,
//   InputAdornment,
//   InputLabel,
//   NativeSelect,
//   Paper,
//   Switch,
//   TextField,
// } from "@material-ui/core";

// import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";

// import MomentUtils from "@date-io/moment";
// import { withSnackbar } from "notistack";
import { UserContext } from "../../../contexts/UserContext";
import mainApi from "../../../api/mainApi";
import { useRef } from "react";
import { useSnackbar, withSnackbar } from "notistack";

const excludeSlugRegexp = new RegExp("^(" + excludeSlug.join("|") + ")$");

const PagesNew = () => {

    const {
        userInfo,
        fetchUserInfo,
        isFetchingUserInfo,
        isAuthenticated,
        logout,
    } = useContext(UserContext);

    const [openKebab, setOpenKebab] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    // const [visible, setVisible] = useState(0);
    const [isClosed, setIsClosed] = useState('');
    const [isClosedBinary, setIsClosedBinary] = useState(true);

    const [sendEmail, setSendEmail] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('Nama');
    // const [connectedStorageProviders, setConnectedStorageProviders] = useState(null);
    const [links, setLinks] = useState([]);
    // const [newLink, setNewLink] = useState({
    //     title: "",
    //     slug: "",
    //     description: "",
    //     deadline: null,
    //     isProtected: false,
    // });

    // const [error, setError] = useState(null);
    // const [success, setSuccess] = useState(null);

    // const [isLinksLoading, setIsLinksLoading] = useState(false);
    // const [showAdd, setShowAdd] = useState(false);

    const wrapperRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
      // mainApi.defaults.headers.post["Content-Type"] = "application/json";
      // mainApi.defaults.headers.common["Authorization"] = localStorage.getItem("bccdrophere_token");
      fetchUserInfo();
      if(userInfo){
        setSendEmail(userInfo.is_verified);
      }
      console.log(userInfo)
    }, [sendEmail]);

    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsClosed(false);
        setIsClosedBinary(true);
      }
    }
    
      
    const setOpenMenu = (closing, binary) => {
      setIsClosed(closing);
      setIsClosedBinary(binary)
    };
  
    const setCloseMenu = () => {

      setIsClosed(false);
      setIsClosedBinary(true);
    };

    
    const handleSendEmail = async (e) => {
      try {
        await mainApi.get("/users/verify",{
          headers: {Authorization: localStorage.getItem("bccdrophere_token")}
        });
        setSendEmail(e);
      } catch (error) {
        console.log(error);
      }
    }

    return (
        <div className={style.container}>
        { sendEmail!=true && <div className={style['verify-alert']}>
          <h6>Verifikasi Email Anda</h6>
          <p>Silahkan periksa email anda untuk mendapatkan link verifikasi. Belum menerima email? <span onClick={() => handleSendEmail(true)}>Kirim ulang</span></p>
          <Dialog
            title="Title"
            visible={openAlert}
            onCancel={() => setOpenAlert(false)}
            primaryButton={{
              text: "Lanjut",
              onClick: () => setOpenAlert(false),
            }}
            secondaryButton={{
              text: "Hapus",
              onClick: () => setOpenAlert(false),
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            cursus fermentum risus, sit amet fringilla nunc pellentesque quis.
            Duis quis odio ultrices, cursus lacus ac, posuere felis.
          </Dialog>
        </div>}

        <div className={style['heading-wrapper']}>
          <div>

          <h1 className={style.heading}>Halaman Anda</h1>
          </div>
          <div className={style.actions}>
            <Search
              className={style['input-search']}
              value={search}
              placeholder="Cari halaman..."
              handleChange={(e) => setSearch(e.target.value)}
            />
            <div className={style.dropdown}>
            <Dropdown value={`Urut: ${sort}`} className={style.dropdown} id='dropdown' placeholder={`Urut: ${sort}`}>
                <DropdownItem
                  key='Nama'
                  onClick={() => setSort('Nama')}
                >
                  Nama
                </DropdownItem>
                <DropdownItem
                  key='Tanggal'
                  onClick={() => setSort('Tanggal')}
                >
                  Tanggal
                </DropdownItem>
            </Dropdown>
            </div>
          </div>
        </div>        

        <div className={style["grid-container"]}>

        {links.length <= 0
          ? ""
          : links.map((link, linkIdx) => {
              return (
                <div className={style["item"]} key={"link" + linkIdx}>
                  <div className={style.body}>
                    <div className={style.top}>
                      <img src="/img/icons/dropbox-active.svg" alt="dropbox-active" />
                      <div className={style.menu}>
                        { isClosed === linkIdx &&
                          <Menu opened={isClosedBinary}>
                            <Menu.Item name="Edit halaman" onClick={() => setCloseMenu(true)} />
                            <Menu.Item name="Salin link" onClick={() => setCloseMenu(true)} />
                            <Menu.Item name="Hapus" onClick={() => setCloseMenu(true)} />
                          </Menu>
                        }
                      </div>
                      <div ref={wrapperRef} className={style['kebab-menu']} style={{ display: 'inline-block' }}>
                        <button value={linkIdx} onClick={() => setOpenMenu(linkIdx, !isClosedBinary)}></button>    
                      </div>
                    </div>
                    
                    <div className={style.bottom}>
                      <div className={style.title}>
                        <p>{`${link.title}`}</p>
                      </div>
                      <div className={style.files}>
                        <img src="/img/icons/folder.svg" alt="folder" />
                        <p>25 files</p>
                      </div>
                    </div>
                    { openKebab ? 
                    <div className={style['kebab-menu']}>
                      <ul class="dropdown">
                        <li><a href="http://www.g.com">1</a></li>
                        <li><a href="http://www.g.com">2</a></li>
                        <li><a href="http://www.g.com">3</a></li>
                        <li><a href="http://www.g.com">4</a></li>
                      </ul>
                    </div>:
                    <div>
                      
                    </div>
                    }
                  </div>
                  <div className={style.footer}>
                    <div className={style.calendar}>
                      <img src="/img/icons/calendar.svg" alt="calendar" />
                      <p>21 Jul 2021</p>
                    </div>
                    <div className={style.views}>
                      <img src="/img/icons/views.svg" alt="views" />
                      <p>40 Views</p>
                    </div>
                  </div>
                </div>
              );
            })}

        </div>
      </div>
    );
}
 
export default withSnackbar(PagesNew);