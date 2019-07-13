import React from 'react';

import style from '../../../css/drop-content.module.scss';

import Loading from '../../common/Loading';

export default function Content() {
  return(
    <div className={style.container + ' wrapper'}>
      <div className={style.content}>
        <Loading circular />
      </div>
    </div>
  );
}