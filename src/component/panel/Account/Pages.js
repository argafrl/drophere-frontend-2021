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
import mainApi from "../../../api/mainApi";
import PageCard from "./PageCard";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { Helmet } from "react-helmet";
import { getErrorMessage } from "../../../utils/functions";
import { useLocation } from "react-router";
import Loading from "../../common/Loading";

import SortIcon from "../../../assets/images/icons/sort.svg";
import NoPageImage from "../../../assets/images/illustrations/no-page.png";

const Pages = () => {
  const {
    userInfo,
    fetchUserInfo,
    successSendEmailVerification,
    setSuccessSendEmailVerification,
  } = useContext(UserContext);
  const snackbar = useContext(SnackbarContext);
  const { state } = useLocation();

  const [openAlert, setOpenAlert] = useState(false);
  const [verifikasi, setVerifikasi] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Tanggal");
  const [allPages, setAllPages] = useState([]);
  const [isFetchingAllPages, setIsFetchingAllPages] = useState(false);
  const getAllPages = async () => {
    try {
      setIsFetchingAllPages(true);
      const { data } = await mainApi.get("/submissions/");
      setAllPages(data.data);
    } catch (error) {
      snackbar.error(getErrorMessage(error));
    } finally {
      setIsFetchingAllPages(false);
    }
  };

  const deleteSubmission = async (slug) => {
    try {
      await mainApi.delete(`/submissions/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bccdrophere_token")}`,
        },
      });
      getAllPages();
      snackbar.success("Halaman Berhasil Dihapus");
    } catch (error) {
      snackbar.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (userInfo) {
      setVerifikasi(userInfo.is_verified);
    }
  }, [userInfo]);

  useEffect(() => {
    if (state && state.from === "/verify-email") {
      fetchUserInfo();
    }
    getAllPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendEmail = async () => {
    try {
      setIsUpdating(true);
      await mainApi.get("/users/verify");
      setVerifikasi(true);
      setSuccessSendEmailVerification();
      snackbar.success("Email berhasil dikirim");
    } catch (error) {
      console.log(error);
      snackbar.error("Email gagal dikirim");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredPages = allPages
    .sort(
      sort === "Tanggal"
        ? (a, b) => a.due_time.localeCompare(b.due_time)
        : (a, b) => a.title.localeCompare(b.title)
    )
    .filter((page) => page.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={style.container}>
      <Helmet>
        <title>Halaman</title>
      </Helmet>
      {!verifikasi && !successSendEmailVerification && (
        <div className={style["verify-alert"]}>
          <h6>Verifikasi Email Anda</h6>
          <p>
            Silahkan periksa email anda untuk mendapatkan link verifikasi. Belum
            menerima email? <span onClick={handleSendEmail}>Kirim ulang</span>
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

          {isUpdating ? <Loading /> : ""}
        </div>
      )}

      <div className={style["heading-wrapper"]}>
        <div className={style.heading}>
          <h1>Halaman Anda</h1>
        </div>
        <div className={style.actions}>
          <div className={style.search}>
            <Search
              className={style["input-search"]}
              value={search}
              placeholder="Cari halaman..."
              handleChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={style.dropdown}>
            <Dropdown
              value={
                <div>
                  <img src={SortIcon} alt="sort" />
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
                src={NoPageImage}
                alt="Drophere Logo"
                className={style["logo"]}
              />
              <p>Belum ada halaman dibuat</p>
            </div>
          ) : (
            <>
              {filteredPages.length > 0 ? (
                <div className={style["grid-container"]}>
                  {filteredPages.map((link, idx) => {
                    return (
                      <PageCard
                        title={link.title}
                        due_time={link.due_time}
                        slug={link.slug}
                        storage_type={link.storage_type}
                        files={
                          link.gdrive_submissions[0]
                            ? link.gdrive_submissions[0].uploaded_files.length
                            : 0
                        }
                        views={
                          link.gdrive_submissions[0]
                            ? link.gdrive_submissions[0].views.length
                            : 0
                        }
                        onDelete={() => deleteSubmission(link.slug)}
                        key={idx}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className={style["not-found"]}>
                  <img src={NoPageImage} alt="Not Found" />
                  <p>Halaman tidak ditemukan</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Pages;
