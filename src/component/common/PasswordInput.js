import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

export default class PasswordInput extends Component {
  state = { showPassword: false };

  handleChange = (field, value) => {
    this.setState({ ...this.state, [field]: value });
  };

  render() {
    return (
      <div>
        <TextField
          {...this.props}
          type={this.state.showPassword ? 'text' : 'password'}
        />

        <Checkbox
          checked={this.state.showPassword}
          label="Show password"
          onChange={this.handleChange.bind(this, 'showPassword')}
        />
      </div>
    );
  }
}