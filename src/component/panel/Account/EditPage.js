import React, { useContext, useEffect, useState } from "react";
import {
  TextArea,
  Input,
  Switcher,
  Checkbox,
  RadioButton,
  Button,
} from "@bccfilkom/designsystem/build";
import style from "../../../css/account-add-new-page.module.scss";
import { useHistory, useParams } from "react-router";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import Preloader from "../../common/Preloader";
import { Helmet } from "react-helmet";
import { countWords, getErrorMessage } from "../../../utils/functions";
import mainApi from "../../../api/mainApi";

import DriveIcon from "../../../assets/images/icons/drive-active.svg";
import DropboxIcon from "../../../assets/images/icons/dropbox-active.svg";

const AddNewPage = () => {
  const snackbar = useContext(SnackbarContext);
  const history = useHistory();
  const { slug } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [multipleFiles, setMultipleFiles] = useState(false);
  const [specificFileTypes, setSpecificFileTypes] = useState(false);
  const [storage, setStorage] = useState(1);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [useDeadline, setUseDeadline] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [fileTypes, setFileTypes] = useState({
    PDF: true,
    Dokumen: true,
    Presentasi: true,
    Spreadsheet: true,
    Folder: true,
    Image: true,
    Video: true,
    Audio: true,
  });

  const [userSubmissionDetail, setUserSubmissionDetail] = useState(null);
  const [isFetchingUserSubmissionDetail, setIsFetchingUserSubmissionDetail] =
    useState(false);
  const [isUpdatingSubmission, setIsUpdatingSubmission] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.length > 150) {
      snackbar.error("Judul tidak boleh melebihi 150 karakter");
      return;
    }

    if (countWords(description) > 200) {
      snackbar.error("Deskripsi tidak boleh melebihi 200 kata");
      return;
    }

    if (new Date().getTime() >= new Date(deadline).getTime()) {
      snackbar.error("Deadline harus melebihi waktu saat ini");
      return;
    }

    const body = {
      title,
      description,
      password,
      due_time: deadline || null,
      storage_type: 1,
    };

    console.log(body);
    updateSubmission(body);
  };

  const getUserSubmissionDetail = async () => {
    try {
      setIsFetchingUserSubmissionDetail(true);
      const { data } = await mainApi.get(`/submissions/${slug}/details`);
      setUserSubmissionDetail(data.data);
    } catch (error) {
      if (getErrorMessage(error) === "entry not found") {
        history.push("/not-found");
      } else {
        snackbar.error(getErrorMessage(error));
      }
    } finally {
      setIsFetchingUserSubmissionDetail(false);
    }
  };

  useEffect(() => {
    if (!userSubmissionDetail) {
      getUserSubmissionDetail();
    } else {
      setTitle(userSubmissionDetail.title);
      setUsePassword(!!userSubmissionDetail.password);
      setPassword(userSubmissionDetail.password);
      setDescription(userSubmissionDetail.description);
      setUseDeadline(!!userSubmissionDetail.due_time);
      setDeadline(userSubmissionDetail.due_time || "");
      setStorage(userSubmissionDetail.storage_type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSubmissionDetail, slug]);

  const updateSubmission = async (data) => {
    try {
      setIsUpdatingSubmission(true);

      await mainApi.patch(`/submissions/${slug}/edit`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });

      snackbar.success("Halaman Berhasil Diperbarui");
      getUserSubmissionDetail(slug);
    } catch (error) {
      if (getErrorMessage(error) === "entry not found") {
        history.push("/not-found");
      } else {
        snackbar.error(getErrorMessage(error));
      }
    } finally {
      setIsUpdatingSubmission(false);
    }
  };

  return (
    <div className={style["container"]}>
      <Helmet>
        <title>Edit Halaman</title>
      </Helmet>
      {isFetchingUserSubmissionDetail ? (
        <Preloader />
      ) : (
        <>
          <h1>Edit Halaman</h1>
          <p>
            Halaman ini digunakan sebagai tempat pengumpulan file yang anda
            butuhkan
          </p>
          <form onSubmit={handleSubmit} className={style["form"]}>
            <div className={style["form__control"]}>
              <label>Judul</label>
              <Input
                value={title}
                required
                placeholder="Masukkan judul"
                handleChange={(e) => setTitle(e.target.value)}
                hintText={`Jumlah Karakter : ${title.length} karakter, Maksimum: 150 Karakter`}
                action={title.length > 150 ? "warning" : ""}
              />
            </div>
            <div className={style["form__control"]}>
              <label>Deskripsi </label>
              <div className={style["form__control__description"]}>
                <TextArea
                  required
                  placeholder="Masukkan deskripsi halaman"
                  value={description}
                  handleChange={(e) => setDescription(e.target.value)}
                  hintText={`Jumlah Kata : ${countWords(
                    description
                  )} kata, Maksimum: 200 Kata`}
                  isWarning={countWords(description) > 200}
                />
              </div>
            </div>
            {/* <div className={style["form__control"]}>
              <div className={style["form__control__switcher"]}>
                <div>
                  <Switcher
                    disabled
                    checked={multipleFiles}
                    onSlide={() => setMultipleFiles(!multipleFiles)}
                  />
                  <label>Multiple File</label>
                </div>
                <p>Anda dapat mengupload banyak file sekaligus</p>
              </div>
            </div>
            <div className={style["form__control"]}>
              <div className={style["form__control__switcher"]}>
                <div>
                  <Switcher
                    checked={specificFileTypes}
                    disabled
                    onSlide={() => {
                      setSpecificFileTypes(!specificFileTypes);
                    }}
                  />
                  <label>Izinkan Unggah Jenis File Tertentu</label>
                </div>
                <p>Pilih jenis file yang dapat diunggah di halaman ini</p>
              </div>
              <div className={style["form__control__types"]}>
                <div className={style["form__control__types__group"]}>
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="PDF"
                    checked={fileTypes.PDF}
                    onChange={() =>
                      setFileTypes({ ...fileTypes, PDF: !fileTypes.PDF })
                    }
                  />
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="Dokumen"
                    checked={fileTypes.Dokumen}
                    onChange={() =>
                      setFileTypes({
                        ...fileTypes,
                        Dokumen: !fileTypes.Dokumen,
                      })
                    }
                  />
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="Presentasi"
                    checked={fileTypes.Presentasi}
                    onChange={() =>
                      setFileTypes({
                        ...fileTypes,
                        Presentasi: !fileTypes.Presentasi,
                      })
                    }
                  />
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="Spreadsheet"
                    checked={fileTypes.Spreadsheet}
                    onChange={() =>
                      setFileTypes({
                        ...fileTypes,
                        Spreadsheet: !fileTypes.Spreadsheet,
                      })
                    }
                  />
                </div>
                <div className={style["form__control__types__group"]}>
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="Folder"
                    checked={fileTypes.Folder}
                    onChange={() =>
                      setFileTypes({
                        ...fileTypes,
                        Folder: !fileTypes.Folder,
                      })
                    }
                  />
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="Image"
                    checked={fileTypes.Folder}
                    onChange={() =>
                      setFileTypes({
                        ...fileTypes,
                        Folder: !fileTypes.Folder,
                      })
                    }
                  />
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="Video"
                    checked={fileTypes.Video}
                    onChange={() =>
                      setFileTypes({
                        ...fileTypes,
                        Video: !fileTypes.Video,
                      })
                    }
                  />
                  <Checkbox
                    disabled={!specificFileTypes}
                    value="Audio"
                    checked={fileTypes.Audio}
                    onChange={() =>
                      setFileTypes({
                        ...fileTypes,
                        Audio: !fileTypes.Audio,
                      })
                    }
                  />
                </div>
              </div>
            </div> */}

            <div className={style["form__control"]}>
              <div className={style["form__control__switcher"]}>
                <div>
                  <label>Storage Provider</label>
                </div>
                <p>
                  Pilih penyedia penyimpanan untuk menyimpan file dari halaman
                  ini
                </p>
                <div className={style["form__control__storage"]}>
                  <button
                    type="button"
                    className={
                      style["form__control__storage__item"] +
                      " " +
                      style["active"]
                    }
                  >
                    <RadioButton
                      checked={storage === 1}
                      handleChange={() => setStorage(1)}
                      id="option1"
                      value="BCC"
                    />
                    <img src={DriveIcon} alt="drive" />
                    <h3>Google Drive</h3>
                  </button>
                  <button
                    type="button"
                    className={style["form__control__storage__item"]}
                  >
                    <RadioButton disabled id="option1" value="BCC" />{" "}
                    <span
                      className={style["form__control__storage__item__badge"]}
                    >
                      Coming Soon
                    </span>
                    <img src={DropboxIcon} alt="dropbox" />
                    <h3>Dropbox</h3>
                  </button>
                </div>
              </div>
            </div>
            <div className={style["form__control"]}>
              <div className={style["form__control__switcher"]}>
                <div>
                  <Switcher
                    checked={usePassword}
                    onSlide={() => {
                      if (usePassword) {
                        setPassword("");
                      }
                      setUsePassword(!usePassword);
                    }}
                  />
                  <label>Gunakan Password</label>
                </div>
                <p>
                  Gunakan password agar orang asing tidak dapat mengakses
                  halaman ini
                </p>
                <Input
                  value={password}
                  disabled={!usePassword}
                  placeholder="Masukkan password"
                  handleChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className={style["form__control"]}>
              <div className={style["form__control__switcher"]}>
                <div>
                  <Switcher
                    checked={useDeadline}
                    onSlide={() => {
                      if (useDeadline) {
                        setDeadline("");
                      }
                      setUseDeadline(!useDeadline);
                    }}
                  />
                  <label>Terapkan Deadline</label>
                </div>
                <Input
                  value={deadline}
                  disabled={!useDeadline}
                  type="datetime-local"
                  handleChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
            <div className={style["form__button__wrapper"]}>
              <Button
                type="secondary"
                disabled={isUpdatingSubmission}
                onClick={() => history.push("/account/pages")}
              >
                Batalkan
              </Button>
              <Button type="primary" disabled={isUpdatingSubmission}>
                Simpan
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AddNewPage;
