import React, { useEffect, useState } from "react";

import style from "../../../css/account-profile.module.scss";
import Loading from "../../common/Loading";
import Preloader from "../../common/Preloader";

import { Input, Button } from "@bccfilkom/designsystem/build";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";

import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

const ProfileNew = () => {

  const { fetchUserInfo, userInfo, isFetchingUserInfo, update, isUpdating } = useContext(UserContext);

  const [openNama, setOpenNama] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [verifikasi, setVerifikasi] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [nameErr, setNameErr] = useState(null);
  const [currentPasswordErr, setCurrentPasswordErr] = useState(null);
  const [newPasswordErr, setNewPasswordErr] = useState(null);
  const [retypePasswordErr, setRetypePasswordErr] = useState(null);

  const [isUpdateProfileError, setIsUpdateProfileError] = useState(null);
  const [isUpdatedPasswordError, setIsUpdatedPasswordError] = useState(null);

  const [isUpdateProfileLoading, setIsUpdateProfileLoading] = useState(false);
  const [isUpdatePasswordLoading, setIsUpdatePasswordLoading] = useState(false);

  const handleClickOpenNama = () => {
    setOpenNama(!openNama);
  };

  const handleClickOpenPassword = () => {
    setOpenPassword(!openPassword);
  };

  const handleVerifikasi = (e) => {
    setVerifikasi(e);
  };

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    update(profileImage, name, email)
  };

  // const handleChange = (name) => (event) => {
  //   setState({ [name]: event.target.value });
  // };

  const onSave = async (e) => {
    e.preventDefault();

    if (name.length <= 0) {
      setNameErr(new Error("Nama tidak boleh kosong"))
      return;
    }

    setNameErr(null);
    setIsUpdateProfileLoading(true);
    setIsUpdateProfileError(null);
  };

  const onUpdatePassword = async (e) => {
    e.preventDefault();

    let hasError = false;
    let errorStates = {
      currentPasswordErr: null,
      newPasswordErr: null,
      retypePasswordErr: null,
    };

    // check current password
    if (currentPassword.length <= 0) {
      errorStates = {
        ...errorStates,
        currentPasswordErr: new Error("Password tidak boleh kosong"),
      };
      hasError = true;
    }

    // check retype password to match new password
    if (retypePassword !== newPassword) {
      errorStates = {
        ...errorStates,
        retypePasswordErr: new Error("Password tidak cocok"),
      };
      hasError = true;
    }

    // check for empty new password
    if (newPassword.length <= 0) {
      errorStates = {
        ...errorStates,
        newPasswordErr: new Error("Password tidak boleh kosong"),
      };
      hasError = true;
    }

    if (retypePassword.length <= 0) {
      errorStates = {
        ...errorStates,
        retypePasswordErr: new Error("Password tidak boleh kosong"),
      };
      hasError = true;
    }

    // this.setState({
    //   ...errorStates,
    //   isUpdatePasswordLoading: !hasError,
    //   isUpdatePasswordError: null,
    // });
    setIsUpdateProfileLoading(!hasError);
    setIsUpdatedPasswordError(null);
    if (hasError) {
      return;
    }
  };

  useEffect(() => {
    // fetchUserInfo();
    if (userInfo) {
      setName(userInfo.full_name);
      setEmail(userInfo.email);
      setProfileImage(userInfo.profile_image);
      setVerifikasi(userInfo.is_verified)
    }
  },[
    userInfo,
  ])

  useEffect(() => {
    fetchUserInfo();
  },[])

  return (
    <div className={style.container}>
      <h1>Profil</h1>
      <p>Info dasar, seperti nama, email, dan foto yang Anda gunakan</p>
      {!isFetchingUserInfo ? (
        <div className="opening-transition">
          <div className={style["form-wrapper"]}>
            <div
              className={style["form-container"]}
              style={{ borderTop: "none" }}
            >
              <div className={style["form-unedit"]}>
                <div className={style.left}>
                  <p>Foto</p>
                </div>

                <div className={style.middle}>
                  <Avatar
                    alt="Travis Howard"
                    src={profileImage}
                    className={style.avatar}
                  />
                  <div className={style["btn-ubah"]}>
                    <input
                      type="file"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
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
                  </div>
                </div>
                <div className={style.right}>
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
            <div className={style["form-container"]}>
              {openNama ? (
                <form
                  onSubmit={onUpdateProfile}
                  className={style["form-edit"]}
                >
                  <div className={style["form-text"]}>
                    <p>Nama</p>
                  </div>
                  <div className={style["input-wrapper"]}>
                    <Input
                      handleChange={(e) => setName(e.target.value)}
                      value={name}
                      className={style["input"]}
                      placeholder="Nama Lengkap"
                    />
                    <div className={style["button-wrapper"]}>
                      <Button
                        type="secondary"
                        onClick={handleClickOpenNama}
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

                  {isUpdateProfileLoading ? <Loading /> : ""}
                </form>
              ) : (
                <div className={style["form-unedit"]}>
                  <div className={style.left}>
                    <p>Nama</p>
                  </div>
                  <div className={style.middle}>
                    <p>{name}</p>
                  </div>
                  <div className={style.right}>
                    <button
                      type="button"
                      onClick={handleClickOpenNama}
                      className={style["btn-text"]}
                    >
                      <Icon>edit</Icon>Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={style["form-container"]}>
              <div className={style["form-unedit"]}>
                <div className={style.left}>
                  <p>Email</p>
                </div>

                <div className={style.middle}>
                  <p>{email}</p>
                  {email && (
                    <div
                      className={style.verifikasi}
                      style={
                        verifikasi
                          ? { backgroundColor: "#40C02B" }
                          : { backgroundColor: "#F4B12F" }
                      }
                    >
                      {verifikasi ? (
                        <p style={{ color: "white" }}>Terverifikasi</p>
                      ) : (
                        <p>
                          Belum terverifikasi.{" "}
                          <span onClick={handleVerifikasi}>
                            Kirim ulang
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={style["form-container"]}>
              {openPassword ? (
                <form
                  onSubmit={onUpdatePassword}
                  className={style["form-edit"]}
                >
                  <div
                    className={style["form-text"]}
                    style={{ marginTop: "5px" }}
                  >
                    <p>Password</p>
                  </div>
                  <div className={style["input-wrapper"]}>
                    <Input
                      type="password"
                      placeholder="Password lama"
                      disabled={isUpdatePasswordLoading}
                      hintText={
                        currentPasswordErr
                          ? currentPasswordErr.message
                          : ""
                      }
                      error={currentPasswordErr != null}
                      name="current_password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Password Baru"
                      disabled={isUpdatePasswordLoading}
                      // fullWidth
                      hintText={
                        newPasswordErr
                          ? newPasswordErr.message
                          : ""
                      }
                      error={newPasswordErr != null}
                      name="new_password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Input
                      type="password"
                      placeholder="Ulangi Password"
                      disabled={isUpdatePasswordLoading}
                      // fullWidth
                      name="retype_password"
                      hintText={
                        retypePasswordErr
                          ? retypePasswordErr.message
                          : ""
                      }
                      error={retypePasswordErr != null}
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                    />

                    <div className={style["button-wrapper"]}>
                      <Button
                        type="secondary"
                        onClick={handleClickOpenPassword}
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

                  {isUpdatePasswordLoading ? <Loading /> : ""}
                </form>
              ) : (
                <div className={style["form-unedit"]}>
                  <div className={style.left}>
                    <p>Password</p>
                  </div>

                  <div className={style.middle}>
                    <div className={style["btn-ubah"]}>
                      <Button
                        type="primary"
                        onClick={handleClickOpenPassword}
                      >
                        <Icon>edit</Icon>Ubah Password
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
 
export default ProfileNew;