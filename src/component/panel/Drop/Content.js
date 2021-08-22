import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@bccfilkom/designsystem/build";
import { useDropzone } from "react-dropzone";
import style from "../../../css/drop-content.module.scss";
import FileItem from "./FileItem";
import { useParams } from "react-router";
import ConfirmSend from "./ConfirmSend";
import Preloader from "../../common/Preloader";
import moment from "moment";
import NotFound from "../../common/NotFound";
import Inaccessible from "./Inaccessible";
import mainApi from "../../../api/mainApi";
import { getErrorMessage } from "../../../utils/functions";

import AirplaneIcon from "../../../assets/images/icons/airplane.svg";
import CloudUpload from "../../../assets/images/illustrations/cloud-upload.webp";

const Content = () => {
  const { slug } = useParams();

  const [confirmModalShown, showConfirmModal] = useState(false);
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [isFetchingSubmissionInfo, setIsFetchingSubmissionInfo] =
    useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  const onDrop = (receivedFiles) => {
    setFiles(() => receivedFiles);
  };

  const { getRootProps, getInputProps, open, isDragAccept, isDragReject } =
    useDropzone({
      noClick: true,
      noKeyboard: true,
      onDrop,
      multiple: false,
      onDropRejected: () => console.log("rejected"),
    });

  const handleRemove = (deletedFile) => {
    setFiles(files.filter((file) => file !== deletedFile));
  };

  const emptyFiles = () => {
    setFiles([]);
  };

  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    border: files.length > 0 ? "none" : "2px dashed #41A4D5",
    borderRadius: "0.5rem",
    outline: "none",
    margin: "1rem 0",
    transition: "border .24s ease-in-out",
    minHeight: 280,
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "red",
  };

  const dropStyle = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragReject, isDragAccept, acceptStyle, baseStyle, rejectStyle]
  );

  const getSubmissionInfo = async () => {
    try {
      setIsFetchingSubmissionInfo(true);
      const { data } = await mainApi.get(`/submissions/${slug}`);
      setSubmissionInfo(data.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsFetchingSubmissionInfo(false);
    }
  };

  useEffect(() => {
    getSubmissionInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      submissionInfo &&
      moment(submissionInfo.due_time).diff(moment(new Date()), "seconds") > 0
    ) {
      setTimeout(() => {
        getSubmissionInfo();
      }, moment(submissionInfo.due_time).diff(moment(new Date()), "seconds") * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionInfo]);

  if (error === "entry not found") {
    return <NotFound />;
  }

  if (submissionInfo && moment(new Date()).isAfter(submissionInfo.due_time)) {
    return <Inaccessible />;
  }

  const formatBytes = (bytes, decimals) => {
    if (bytes === 0) return "0 Bytes";
    let k = 1024,
      dm = decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className={style["wrapper"]}>
      {isFetchingSubmissionInfo || !submissionInfo ? (
        <Preloader />
      ) : (
        <>
          <ConfirmSend
            open={confirmModalShown}
            onClose={() => showConfirmModal(false)}
            files={files}
            formatBytes={formatBytes}
            emptyFiles={emptyFiles}
            hasPassword={submissionInfo.has_password}
          />
          <div className={style["page"]}>
            <h1>{submissionInfo.title}</h1>
            <div className={style["page__description"]}>
              {submissionInfo.description}
            </div>
            <div className={style["page__deadline"]}>
              Halaman ini akan ditutup dalam{" "}
              <strong>
                {moment(submissionInfo.due_time).locale("id").toNow(true)}
              </strong>
            </div>
          </div>
          <div className={style["container"]}>
            <div className={style["container-inner"]}>
              <Button type="secondary" onClick={open}>
                + Pilih File
              </Button>
              <div
                {...getRootProps({
                  style: dropStyle,
                  className: style["drop-container"],
                })}
              >
                <input {...getInputProps()} />
                {files.length > 0 ? (
                  <div className={style["file-container"]}>
                    {files.map((file, i) => (
                      <FileItem
                        key={i}
                        name={file.name}
                        size={formatBytes(file.size)}
                        onRemove={() => handleRemove(file)}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <img
                      src={CloudUpload}
                      alt="cloud"
                      className={style["cloud-icon"]}
                    />
                    <h2>Letakkan file anda disini</h2>
                    <p>Mendukung format PDF, PNG, RAR</p>
                  </>
                )}
              </div>
              <div className={style["btn-send"]}>
                <Button
                  type="primary"
                  onClick={() => showConfirmModal(true)}
                  disabled={files.length === 0}
                  icon={AirplaneIcon}
                >
                  Kirim File
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Content;
