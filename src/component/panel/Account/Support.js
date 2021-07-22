import React, { useState } from 'react';

import style from '../../../css/account-support.module.scss';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';

export default function Support() {
  const [message, setMessage] = useState('');

  const onSubmitHandler = e => {
    e.preventDefault();
    
    setMessage('');
  }

  return (
    <div className={style.container}>
      <h1>Kirim Masukan</h1>
      <p>Masukan anda dapat membantu layanan kami agar lebih maksimal</p>
      <div className='opening-transition'>
        <form onSubmit={onSubmitHandler}>
          <TextField
            type="textarea"
            variant="outlined"
            label="Message"
            placeholder="Your message ..."
            value={message}
            onChange={(event) => { setMessage(event.target.value) }}
            multiline
            fullWidth
            maxLength={500}
            rows={5}
          />
          <div className={style['button-wrapper']} style={{ marginBottom: 40 }}>
            <Button size="large" variant="outlined" color="primary" type="submit">
              Send
              <Icon style={{ fontSize: 20, marginLeft: 8 }}>send</Icon>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}