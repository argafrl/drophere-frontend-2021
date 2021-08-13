import React, { useContext, useEffect, useState } from "react";
import style from "../../../css/pages.module.scss";
import {
  Dropdown,
  DropdownItem,
  Search,
  Dialog,
} from "@bccfilkom/designsystem/build";
import { UserContext } from "../../../contexts/UserContext";
import { PageContext } from "../../../contexts/PageContext";
import mainApi from "../../../api/mainApi";
import PageCard from "./PageCard";

const PagesNew = () => {
  const { userInfo } = useContext(UserContext);
  const { allPages, getAllPages, isFetchingAllPages } = useContext(PageContext);

  const [allPagesFiltered, setAllPagesFiltered] = useState([])
  const [openAlert, setOpenAlert] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Nama");

  useEffect(() => {
    if (userInfo) {
      setSendEmail(userInfo.is_verified);
    }
    getAllPages();
  }, [getAllPages, userInfo]);

  const handleSendEmail = async (e) => {
    try {
      await mainApi.get("/users/verify");
      setSendEmail(e);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (inputSearch) => {
    console.log(inputSearch);
    const filtered = allPages.filter((link, idx) => {
      return link.title.toLowerCase().includes(inputSearch.toLowerCase())
    })
    setSearch(inputSearch);
    setAllPagesFiltered(filtered);
  }

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
        <div>
          <h1 className={style.heading}>Halaman Anda</h1>
        </div>
        <div className={style.actions}>
          <Search
            className={style["input-search"]}
            value={search}
            placeholder="Cari halaman..."
            handleChange={(e) => handleSearch(e.target.value)}
          />
          <div className={style.dropdown}>
            <Dropdown
              value={`Urut: ${sort}`}
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
        "Loading..."
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
              { search ? 
                allPagesFiltered.map((link, idx) => {
                  return <PageCard title={link.title} due_time={link.due_time} storage_type={link.storage_type} key={idx} />;
                }) 
              : 
                allPages.map((link, idx) => {
                  return <PageCard title={link.title} due_time={link.due_time} storage_type={link.storage_type} key={idx} />;
                })
              }
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PagesNew;
