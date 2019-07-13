import React from 'react';

import style from '../../../css/drop-file.module.scss';
import { Icon } from '@material-ui/core';

const ProgressBar = ({ progress }) => (
  <div style={{
    width: (progress * 100).toString() + '%',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#a6dcf0',
    zIndex: 0,
    transition: "width .5s",
  }} />
);

function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Bytes';
  var k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const FileItemProgressStatus = props => {
  let {
    isFailed,
    isUploading,
    percentage,
  } = props;


  if (isNaN(percentage)) {
    percentage = 0;
  }

  if (isFailed) {
    return (
      <div style={{ color: "red", fontSize: 16, display: "flex", alignItems: "center" }}>
        <span style={{ paddingRight: 5 }}>Upload failed</span>
        <Icon>alert_circle</Icon>
      </div>
    );
  }

  if (percentage === 1) {
    if (isUploading) {
      return <span>Syncing...</span>
    }

    return <span>&#10004;</span>;
  }

  return <span>{(percentage * 100).toFixed(2)}%</span>;
};

const FileItem = props => {
  

  return (
    <div className={style['file-list-item']}>
      {props.percentage !== 1 ? <ProgressBar progress={props.percentage} /> : ''}
      <span>{props.title}</span>
      <span className={style['percentage-and-size']}>
        <span className={style['percentage']}>
          <FileItemProgressStatus
            {...props}
          />
        </span>
        {formatBytes(props.size)}
      </span>
    </div>
  );
}
export default FileItem;