import React, { useState } from "react";

const ProfileNew = () => {

  const [openName, setOpenName] = useState(false);
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

  const [isUpdateeProfileLoading, setIsUpdateeProfileLoading] = useState(false);
  const [isUpdatePasswordLoading, setIsUpdatePasswordLoading] = useState(false);

  return (
    <div className={style.container}>
      <h1>Profil</h1>
      <p>Info dasar, seperti nama, email, dan foto yang Anda gunakan</p>
      {!this.context.isFetchingUserInfo ? (
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
                    src={this.state.profile_image}
                    className={style.avatar}
                  />
                  <div className={style["btn-ubah"]}>
                    <input
                      type="file"
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
                    onClick={this.handleClickOpen}
                    className={style["btn-text"]}
                  >
                    <Icon>delete</Icon>Hapus
                  </button>
                </div>
              </div>
            </div>
            <div className={style["form-container"]}>
              {this.state.openNama ? (
                <form
                  onSubmit={this.onUpdateProfile}
                  className={style["form-edit"]}
                >
                  <div className={style["form-text"]}>
                    <p>Nama</p>
                  </div>
                  <div className={style["input-wrapper"]}>
                    <Input
                      handleChange={this.handleChange("name")}
                      value={this.state.name}
                      className={style["input"]}
                      placeholder="Nama Lengkap"
                    />
                    <div className={style["button-wrapper"]}>
                      <Button
                        type="secondary"
                        onClick={this.handleClickOpenNama}
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

                  {this.state.isUpdateProfileLoading ? <Loading /> : ""}
                </form>
              ) : (
                <div className={style["form-unedit"]}>
                  <div className={style.left}>
                    <p>Nama</p>
                  </div>
                  <div className={style.middle}>
                    <p>{this.state.name}</p>
                  </div>
                  <div className={style.right}>
                    <button
                      type="button"
                      onClick={this.handleClickOpenNama}
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
                  <p style={{ color: "#05A1D1" }}>{this.state.email}</p>
                  {this.state.email && (
                    <div
                      className={style.verifikasi}
                      style={
                        this.state.verifikasi
                          ? { backgroundColor: "#40C02B" }
                          : { backgroundColor: "#F4B12F" }
                      }
                    >
                      {this.state.verifikasi ? (
                        <p style={{ color: "white" }}>Terverifikasi</p>
                      ) : (
                        <p>
                          Belum terverifikasi.{" "}
                          <span onClick={this.handleVerifikasi}>
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
              {this.state.openPassword ? (
                <form
                  onSubmit={this.onUpdatePassword}
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
                      disabled={this.state.isUpdatePasswordLoading}
                      hintText={
                        this.state.currentPasswordErr
                          ? this.state.currentPasswordErr.message
                          : ""
                      }
                      error={this.state.currentPasswordErr != null}
                      name="current_password"
                      value={this.state.currentPassword}
                      onChange={this.handleChange("currentPassword")}
                    />
                    <Input
                      type="password"
                      placeholder="Password Baru"
                      disabled={this.state.isUpdatePasswordLoading}
                      // fullWidth
                      hintText={
                        this.state.newPasswordErr
                          ? this.state.newPasswordErr.message
                          : ""
                      }
                      error={this.state.newPasswordErr != null}
                      name="new_password"
                      value={this.state.newPassword}
                      onChange={this.handleChange("newPassword")}
                    />

                    <Input
                      type="password"
                      placeholder="Ulangi Password"
                      disabled={this.state.isUpdatePasswordLoading}
                      // fullWidth
                      name="retype_password"
                      hintText={
                        this.state.retypePasswordErr
                          ? this.state.retypePasswordErr.message
                          : ""
                      }
                      error={this.state.retypePasswordErr != null}
                      value={this.state.retypePassword}
                      onChange={this.handleChange("retypePassword")}
                    />

                    <div className={style["button-wrapper"]}>
                      <Button
                        type="secondary"
                        onClick={this.handleClickOpenPassword}
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

                  {this.state.isUpdatePasswordLoading ? <Loading /> : ""}
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
                        onClick={this.handleClickOpenPassword}
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