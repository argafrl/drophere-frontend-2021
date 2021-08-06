import React from "react";
import {
  TextArea,
  Input,
  Switcher,
  Checkbox,
  RadioButton,
  Button,
} from "@bccfilkom/designsystem/build";
import style from "../../../css/account-add-new-page.module.scss";

const AddNewPage = () => {
  return (
    <div className={style["container"]}>
      <h1>Buat Halaman</h1>
      <p>
        Halaman ini digunakan sebagai tempat pengumpulan file yang anda butuhkan
      </p>
      <form className={style["form"]}>
        <div className={style["form__control"]}>
          <label>Judul</label>
          <Input value="" />
        </div>
        <div className={style["form__control"]}>
          <label>Link Halaman</label>
          <div className={style["form__control__link"]}>
            <p>https://drophere.link/ </p>
            <Input
              value=""
              hintText="Karakter meliputi : huruf, nomor, dash dan underscore"
            />
          </div>
        </div>
        <div className={style["form__control"]}>
          <label>Deskripsi </label>
          <div className={style["form__control__description"]}>
            <TextArea value="" hintText="Maks : 200 Karakter" />
          </div>
        </div>
        <div className={style["form__control"]}>
          <div className={style["form__control__switcher"]}>
            <div>
              <Switcher checked />
              <label>Multiple File</label>
            </div>
            <p>Anda dapat mengupload banyak file sekaligus</p>
          </div>
        </div>
        <div className={style["form__control"]}>
          <label>Jenis File</label>
          <p>Pilih jenis file yang dapat diunggah di halaman ini</p>
          <div className={style["form__control__types"]}>
            <Checkbox value="Pilih Semua" />
            <Checkbox value="DOC" />
            <Checkbox value="PPT" />
            <Checkbox value="PDF" />
            <Checkbox value="JPEG" />
            <Checkbox value="ZIP" />
            <Checkbox value="RAR" />
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
                <RadioButton checked id="option1" value="BCC" />
                <img src="/img/icons/dropbox-active.svg" alt="drive" />
                <h3>Dropbox</h3>
              </button>
              <button
                type="button"
                className={style["form__control__storage__item"]}
              >
                <RadioButton disabled id="option1" value="BCC" />
                <span className={style["form__control__storage__item__badge"]}>
                  Coming Soon
                </span>
                <img src="/img/icons/drive-active.svg" alt="drive" />
                <h3>Google Drive</h3>
              </button>
            </div>
          </div>
        </div>
        <div className={style["form__control"]}>
          <div className={style["form__control__switcher"]}>
            <div>
              <Switcher checked />
              <label>Gunakan Password</label>
            </div>
            <p>
              Gunakan password agar orang asing tidak dapat mengakses halaman
              ini
            </p>
            <Input value="" />
          </div>
        </div>
        <div className={style["form__control"]}>
          <div className={style["form__control__switcher"]}>
            <div>
              <Switcher checked />
              <label>Terapkan Deadline</label>
            </div>
            <p>
              Gunakan password agar orang asing tidak dapat mengakses halaman
              ini
            </p>
            <Input value="" type="date" />
          </div>
        </div>
        <div className={style["form__button__wrapper"]}>
          <Button type="secondary">Batalkan</Button>
          <Button type="primary">Buat Halaman</Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewPage;
