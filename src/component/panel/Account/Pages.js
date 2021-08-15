import React, { useContext, useEffect, useState } from "react";
import style from "../../../css/pages.module.scss";
import {
  Dropdown,
  DropdownItem,
  Search,
  Dialog,
} from "@bccfilkom/designsystem/build";
import Preloader from "../../common/Preloader";
import { UserContext } from "../../../contexts/UserContext";
import { PageContext } from "../../../contexts/PageContext";
import mainApi from "../../../api/mainApi";
import PageCard from "./PageCard";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const Pages = () => {
  const { userInfo } = useContext(UserContext);
  const {
    allPages,
    getAllPages,
    isFetchingAllPages,
    successCreatingSubmission,
    clearCreateSubmissionSuccess,
    clearDeleteSubmissionSuccess,
    successDeleteSubmission,
  } = useContext(PageContext);
  const snackbar = useContext(SnackbarContext);

  const [openAlert, setOpenAlert] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Tanggal");
  useEffect(() => {
    console.log("rerender pages")
    if (userInfo) {
      setSendEmail(userInfo.is_verified);
    }
    if (successCreatingSubmission) {
      snackbar.success("Halaman Berhasil Dibuat");
      clearCreateSubmissionSuccess();
    }
    if (successDeleteSubmission) {
      console.log("render success")
      snackbar.success("Halaman Berhasil Dihapus");
      clearDeleteSubmissionSuccess();
    }
    getAllPages();
  }, [
    getAllPages,
    userInfo,
    snackbar,
    clearCreateSubmissionSuccess,
    clearDeleteSubmissionSuccess,
    successCreatingSubmission,
    successDeleteSubmission,
  ]);

  const handleSendEmail = async (e) => {
    try {
      await mainApi.get("/users/verify");
      setSendEmail(e);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.container}>
      {!sendEmail && (
        <div className={style["verify-alert"]}>
          <h6>Verifikasi Email Anda</h6>
          <p>
            Silahkan periksa email anda untuk mendapatkan link verifikasi. Belum
            menerima email?{" "}
            <span onClick={() => handleSendEmail(true)}>Kirim ulang</span>
          </p>
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
        </div>
      )}

      <div className={style["heading-wrapper"]}>
        <div className={style.heading}>
          <h1>Halaman Anda</h1>
        </div>
        <div className={style.actions}>
          <Search
            className={style["input-search"]}
            value={search}
            placeholder="Cari halaman..."
            handleChange={(e) => setSearch(e.target.value)}
          />
          <div className={style.dropdown}>
            <Dropdown
              value={
                <div>
                  <img src="/img/icons/sort.svg" alt="sort" />
                  {`Urut: ${sort}`}
                </div>
              }
              className={style.dropdown}
              id="dropdown"
              placeholder={`Urut: ${sort}`}
            >
              <DropdownItem key="Nama" onClick={() => setSort("Nama")}>
                Nama
              </DropdownItem>
              <DropdownItem key="Tanggal" onClick={() => setSort("Tanggal")}>
                Tanggal
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>

      {isFetchingAllPages ? (
        <Preloader />
      ) : (
        <>
          {allPages.length === 0 ? (
            <div className={style["noPage-container"]}>
              <img
                src="/img/no-page.png"
                alt="Drophere Logo"
                className={style["logo"]}
              />
              <p>Belum ada halaman dibuat</p>
            </div>
          ) : (
            <div className={style["grid-container"]}>
              {allPages
                .sort(
                  sort === "Tanggal"
                    ? (a, b) => a.due_time.localeCompare(b.due_time)
                    : (a, b) => a.title.localeCompare(b.title)
                )
                .filter((page) => {
                  if (!search) {
                    return page;
                  } else if (
                    page.title.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return page;
                  }
                })
                .map((link, idx) => {
                  return (
                    <PageCard
                      title={link.title}
                      due_time={link.due_time}
                      slug={link.slug}
                      storage_type={link.storage_type}
                      key={idx}
                    />
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pages;
