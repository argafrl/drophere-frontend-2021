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
import { PageContext } from "../../../contexts/PageContext";
import { useHistory } from "react-router";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const AddNewPage = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [multipleFiles, setMultipleFiles] = useState(false);
  const [specificFileTypes, setSpecificFileTypes] = useState(false);
  const [storage, setStorage] = useState(1);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [useDeadline, setUseDeadline] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
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

  const {
    createSubmission,
    isCreatingSubmission,
    successCreatingSubmission,
    error: errorFromBackend,
  } = useContext(PageContext);
  const snackbar = useContext(SnackbarContext);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (title.length > 10) {
      setError("Judul tidak boleh melebihi 150 karakter");
      return;
    }

    if (description.length > 200) {
      setError("Deskripsi tidak boleh melebihi 200 karakter");
      return;
    }

    if (!characterCheck(link)) {
      setError("Link tidak valid");
      return;
    }

    if (!useDeadline) {
      setError("Deadline harus ditetapkan");
      return;
    }

    if (new Date().getTime() >= new Date(deadline).getTime()) {
      setError("Deadline harus melebihi waktu saat ini");
      return;
    }

    const body = {
      title,
      description,
      slug: link,
      password,
      due_time: deadline,
      storage_type: 1,
    };

    createSubmission(
      Object.keys(body)
        .filter((key) => body[key])
        .reduce((acc, key) => ({ ...acc, [key]: body[key] }), {})
    );
  };

  useEffect(() => {
    if (error) {
      snackbar.error(error);
      return;
    }
    if (errorFromBackend) {
      snackbar.error(errorFromBackend);
      return;
    }
    if (successCreatingSubmission) {
      history.push("/account/pages");
    }
  }, [successCreatingSubmission, errorFromBackend, error]);

  const countWords = (str) => {
    return str.split(" ").filter((word) => word != "").length;
  };

  const characterCheck = (str) => {
    const acceptedCriteria = /^[-A-Za-z0-9_]+$/;
    if (!str) {
      return true;
    }
    return acceptedCriteria.test(str);
  };

  return (
    <div className={style["container"]}>
      <h1>Buat Halaman</h1>
      <p>
        Halaman ini digunakan sebagai tempat pengumpulan file yang anda butuhkan
      </p>
      <form onSubmit={handleSubmit} className={style["form"]}>
        <div className={style["form__control"]}>
          <label>Judul</label>
          <Input
            value={title}
            required
            handleChange={(e) => setTitle(e.target.value)}
            action={title.length > 150 ? "warning" : ""}
          />
        </div>
        <div className={style["form__control"]}>
          <label>Link Halaman</label>
          <div className={style["form__control__link"]}>
            <p>https://drophere.link/ </p>
            <Input
              required
              value={link}
              handleChange={(e) => setLink(e.target.value)}
              hintText="Karakter meliputi : huruf, nomor, dash dan underscore"
              action={characterCheck(link) ? "" : "warning"}
            />
          </div>
        </div>
        <div className={style["form__control"]}>
          <label>Deskripsi </label>
          <div className={style["form__control__description"]}>
            <TextArea
              required
              value={description}
              handleChange={(e) => setDescription(e.target.value)}
              hintText="Maks : 200 Karakter"
              isWarning={description.length > 200}
            />
          </div>
        </div>
        <div className={style["form__control"]}>
          <div className={style["form__control__switcher"]}>
            <div>
              <Switcher
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
        </div>

        <div className={style["form__control"]}>
          <div className={style["form__control__switcher"]}>
            <div>
              <label>Storage Provider</label>
            </div>
            <p>
              Pilih penyedia penyimpanan untuk menyimpan file dari halaman ini
            </p>
            <div className={style["form__control__storage"]}>
              <button
                type="button"
                className={
                  style["form__control__storage__item"] + " " + style["active"]
                }
              >
                <RadioButton
                  checked={storage === 1}
                  handleChange={() => setStorage(1)}
                  id="option1"
                  value="BCC"
                />
                <img src="/img/icons/drive-active.svg" alt="drive" />
                <h3>Google Drive</h3>
              </button>
              <button
                type="button"
                className={style["form__control__storage__item"]}
              >
                <RadioButton disabled id="option1" value="BCC" />{" "}
                <span className={style["form__control__storage__item__badge"]}>
                  Coming Soon
                </span>
                <img src="/img/icons/dropbox-active.svg" alt="dropbox" />
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
              Gunakan password agar orang asing tidak dapat mengakses halaman
              ini
            </p>
            <Input
              value={password}
              disabled={!usePassword}
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
            <p>
              Gunakan password agar orang asing tidak dapat mengakses halaman
              ini
            </p>
            <Input
              value={deadline}
              type="datetime-local"
              disabled={!useDeadline}
              handleChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>
        <div className={style["form__button__wrapper"]}>
          <Button
            type="secondary"
            disabled={isCreatingSubmission}
            onClick={() => history.push("/account/pages")}
          >
            Batalkan
          </Button>
          <Button type="primary" disabled={isCreatingSubmission}>
            Buat Halaman
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewPage;
