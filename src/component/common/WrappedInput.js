import React from 'react';
import TextField from '@material-ui/core/TextField';
import PasswordInput from './PasswordInput'

export default props => {
  return (
    <React.Fragment>
      {
        props.password ? <PasswordInput {...props} />
          : <TextField {...props} />
      }
    </React.Fragment>
  );
}