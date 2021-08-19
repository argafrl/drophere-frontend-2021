import React, { useEffect, useState, useContext } from "react";

import style from "../../../css/account-profile.module.scss";
import Loading from "../../common/Loading";
import Preloader from "../../common/Preloader";

import { Input, Button, Password } from "@bccfilkom/designsystem/build";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";

import { UserContext } from "../../../contexts/UserContext";

import { Helmet } from "react-helmet";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const Profile = () => {

  const { fetchUserInfo, userInfo, isFetchingUserInfo, clearUserInfo, updateName, updatePassword, updateProfileImage, isUpdating, successUpdating, errorUpdating, clearError } = useContext(UserContext);

  const snackbar = useContext(SnackbarContext);

  const [openNama, setOpenNama] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [verifikasi, setVerifikasi] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [isShowCurrent, setIsShowCurrent] = useState(false)
  const [isShowNew, setIsShowNew] = useState(false)
  const [isShowRetype, setIsShowRetype] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const onUpdateName = async (e) => {
    e.preventDefault();
    console.log(profileImage);
    if (name.length <= 0) {
      snackbar.error("Nama tidak boleh kosong");
      setName(userInfo.full_name);
      return;
    }
    updateName(name);
  };

  const onUpdatePassword = async (e) => {
    e.preventDefault();

    if (currentPassword.length <= 0) {
      snackbar.error("Password tidak boleh kosong");
      return;
    }

    if (retypePassword !== newPassword) {
      snackbar.error("Password tidak cocok");
      return;
    }

    if (newPassword.length <= 0) {
      snackbar.error("Password tidak boleh kosong");
      return;
    }

    if (retypePassword.length <= 0) {
      snackbar.error("Password tidak boleh kosong");
      return;
    }

    updatePassword(currentPassword, retypePassword);
  };

  const onUpdateProfileImage = async (e) => {
    setProfileImage(e.target.files[0]);
    if (profileImage.length <= 0) {
      snackbar.error("File tidak boleh kosong");
      return;
    }
    updateProfileImage(e.target.files[0]);
  };

  useEffect(() => {
    // fetchUserInfo();
    if (userInfo) {
      setName(userInfo.full_name);
      setEmail(userInfo.email);
      setProfileImage(userInfo.profile_image);
      setVerifikasi(userInfo.is_verified)
    } else {
      fetchUserInfo();
    }
    if (successUpdating){
      snackbar.success("Profil berhasil diperbarui");
      setCurrentPassword("");
      setNewPassword("");
      setRetypePassword("");
      clearUserInfo();
    }
    else if (errorUpdating){
      snackbar.error(errorUpdating);
      clearError();
    }
  },[
    userInfo,
    successUpdating,
    errorUpdating
  ])

  return (
    <div className={style.container}>
      <Helmet>
          <title>Profil</title>
      </Helmet>
      <h1>Profil</h1>
      <p>Info dasar, seperti nama, email, dan foto yang Anda gunakan</p>
      {!isFetchingUserInfo ? (
        <div className="opening-transition">
          <div className={style["form-wrapper"]}>
            
            {/* Input Foto */}
            <div
              className={style["form-container"]}
              style={{ borderTop: "none" }}
            >
              <div className={style["form-unedit"]}>

                <div className={style.left}>
                  <p>Foto</p>
                </div>

                <div className={style.middle}>
                  <div className={style["item-1"]}>
                    <Avatar
                      alt="Travis Howard"
                      // src={profileImage}
                      className={style.avatar}
                    />
                    <div className={style["btn-ubah"]}>
                      <input
                        type="file"
                        // value={profileImage}
                        onChange={(e) => onUpdateProfileImage(e)}
                        name="avatar"
                        id="btn-avatar"
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <div className={style["btn-avatar-wrapper"]}>
                        <label htmlFor="btn-avatar">
                          <CameraAltOutlinedIcon />
                          Ubah
                        </label>
                      </div>
                      {isUpdating? <Loading /> : ""}
                    </div>
                  </div>

                  <div className={style["item-2"]}>
                    <button
                      type="button"
                      // onClick={handleClickOpen}
                      className={style["btn-text"]}
                    >
                      <Icon>delete</Icon>Hapus
                    </button>
                  </div>
                  
                </div>
              </div>
            </div>
            
            {/* Input Nama */}
            <div className={style["form-container"]}>
              {openNama ? (
                <form
                  onSubmit={onUpdateName}
                  className={style["form-edit"]}
                >
                  <div className={style["form-text"]}>
                    <p>Nama</p>
                  </div>
                  <div className={style["input-wrapper"]}>
                    <div className={style["input-container"]}>
                      <Input
                        type="text"
                        handleChange={(e) => setName(e.target.value)}
                        value={name}
                        className={style["input"]}
                        placeholder="Nama Lengkap"
                      />
                    </div>
                    <div className={style["button-wrapper"]}>
                      <Button
                        type="secondary"
                        onClick={() => setOpenNama(!openNama)}
                        className={style["btn-batal"]}
                      >
                        Batalkan
                      </Button>
                      <Button
                        size="large"
                        variant="outlined"
                        color="primary"
                        type="submit"
                      >
                        Simpan
                      </Button>
                    </div>
                  </div>

                  {isUpdating? <Loading /> : ""}
                </form>
              ) : (
                <div className={style["form-unedit"]}>
                  <div className={style.left}>
                    <p>Nama</p>
                  </div>
                  <div className={style.middle}>
                    <div className={style["item-1"]}>
                      <p>{name}</p>
                    </div>
                    <div className={style["item-2"]}>
                      <button
                        type="button"
                        onClick={() => setOpenNama(!openNama)}
                        className={style["btn-text"]}
                      >
                        <Icon>edit</Icon>Edit
                      </button>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>

            {/* Input Email */}
            <div className={style["form-container"]}>
              <div className={style["form-unedit"]}>
                <div className={style.left}>
                  <p>Email</p>
                </div>

                <div className={style.middle}>
                  <div className={style["item-1"]}>
                  <p>{email}</p>
                  { email && (
                    <div
                      className={style.verifikasi}
                      style={ verifikasi
                          ? { backgroundColor: "#40C02B" }
                          : { backgroundColor: "#F4B12F" }}>
                      { verifikasi ? (
                        <p style={{ color: "white" }}>Terverifikasi</p>
                      ) : (
                        <p> Belum terverifikasi.{" "}
                          <span onClick={(e) => setVerifikasi(e)}>
                            Kirim ulang
                          </span>
                        </p>
                      )}
                    </div>)}
                  </div> 
                </div>
              </div>
            </div>

            {/* Input Password */}
            <div className={style["form-container"]}>
              {openPassword ? (
                <form
                  onSubmit={onUpdatePassword}
                  className={style["form-edit"]}
                >
                  <div className={style["form-text"]}>
                    <p>Password</p>
                  </div>
                  <div className={style["input-wrapper"]}>
                    <div className={style["input-container"]}>
                    <Password
                      type="password"
                      placeholder="Password lama"
                      name="current_password"
                      value={currentPassword}
                      handleChange={(e) => setCurrentPassword(e.target.value)}
                      visibilityEye={isShowCurrent}
                      handleShow={() => setIsShowCurrent(!isShowCurrent)}
                    />
                    
                    <Password
                      type="password"
                      placeholder="Password Baru"
                      name="new_password"
                      value={newPassword}
                      handleChange={(e) => setNewPassword(e.target.value)}
                      visibilityEye={isShowNew}
                      handleShow={() => setIsShowNew(!isShowNew)}
                    />

                    <Password
                      type="password"
                      placeholder="Ulangi Password"
                      name="retype_password"
                      value={retypePassword}
                      handleChange={(e) => setRetypePassword(e.target.value)}
                      visibilityEye={isShowRetype}
                      handleShow={() => setIsShowRetype(!isShowRetype)}
                    />
                    </div>

                    <div className={style["button-wrapper"]}>
                      <Button
                        type="secondary"
                        onClick={() => setOpenPassword(!openPassword)}
                        className={style["btn-batal"]}
                      >
                        Batalkan
                      </Button>
                      <Button
                        size="large"
                        variant="outlined"
                        color="primary"
                        type="submit"
                      >
                        Simpan
                      </Button>
                    </div>
                  </div>

                  {isUpdating ? <Loading /> : ""}
                </form>
              ) : (
                <div className={style["form-unedit"]}>
                  <div className={style.left}>
                    <p>Password</p>
                  </div>

                  <div className={style.middle}>
                    <div className={style["btn-ubah"]}>
                      <Button
                        condensed
                        icon="/img/icons/edit.svg"
                        onClick={() => setOpenPassword(!openPassword)}
                      >
                        Ubah Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Preloader />
      )}
    </div>
  );
}
 
export default Profile;