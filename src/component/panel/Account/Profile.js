import React, { Component } from 'react';
import axios from 'axios';

import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/account-profile.module.scss';
import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';
import Preloader from '../../common/Preloader';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withSnackbar } from 'notistack';

class Profile extends Component {

  static contextType = TokenContext;

  state = {
    name: '',
    email: '',

    currentPassword: '',
    newPassword: '',
    retypePassword: '',

    nameErr: null,
    currentPasswordErr: null,
    newPasswordErr: null,
    retypePasswordErr: null,

    isUpdateProfileError: null,
    isUpdatePasswordError: null,

    isUpdateProfileLoading: false,
    isUpdatePasswordLoading: false,

    // isPageLoading: true,
  };

  // async componentDidMount() {
  //   try {

  //     const resp = await axios.post(endpointURL, {
  //       query: `
  //       query {
  //         me {
  //           email
  //           name
  //         }
  //       }`
  //     })
  //     if (resp.data.errors) {
  //       throw new Error(resp.data.errors[0].message);
  //     }

  //     const { name, email } = resp.data.data.me;
  //     this.setState({ name, email, isPageLoading: false });
  //   } catch (error) {
  //     this.props.enqueueSnackbar('Error when fetching user profile', { variant: 'error' });
  //     this.setState({ isPageLoading: false });
  //     this.context.setToken('');
  //     this.props.history.push('/home');
  //   }
  // }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  onSave = async (e) => {
    e.preventDefault();

    const { name } = this.state;

    // check input name
    if (name.length <= 0) {
      this.setState({ nameErr: new Error('Nama tidak boleh kosong') })
      return
    }
    // reset error state
    this.setState({
      nameErr: null,
      isUpdateProfileLoading: true,
      isUpdateProfileError: null,
    })
    try {

      // make the request
      const resp = await axios.post(endpointURL, {
        query: `
      mutation updateProfile($newName:String!){
        updateProfile(newName:$newName){
          message
        }
      }`,
        variables: {
          newName: name,
        },
        operationName: "updateProfile",
      })

      const updateProfileResp = resp.data.data.updateProfile;
      if (updateProfileResp) {
        this.props.enqueueSnackbar('Profile successfully updated', { variant: 'success' });
        this.setState({ isUpdateProfileLoading: false })
        return
      }
      throw new Error(resp.data.errors[0].message);
    } catch (error) {
      this.props.enqueueSnackbar('Error when updating profile', { variant: 'error' });
      console.log('error happen: ' + error);
      this.setState({
        isUpdateProfileLoading: false,
        isUpdateProfileError: error,
      })
    }

  }

  onUpdatePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, retypePassword, newPassword } = this.state;

    let hasError = false;
    let errorStates = {
      currentPasswordErr: null,
      newPasswordErr: null,
      retypePasswordErr: null,
    };

    // check current password
    if (currentPassword.length <= 0) {
      errorStates = { ...errorStates, currentPasswordErr: new Error('Password tidak boleh kosong') }
      hasError = true;
    }

    // check retype password to match new password
    if (retypePassword !== newPassword) {
      errorStates = { ...errorStates, retypePasswordErr: new Error('Password tidak cocok') }
      hasError = true;
    }

    // check for empty new password
    if (newPassword.length <= 0) {
      errorStates = { ...errorStates, newPasswordErr: new Error('Password tidak boleh kosong') }
      hasError = true;
    }

    if (retypePassword.length <= 0) {
      errorStates = { ...errorStates, retypePasswordErr: new Error('Password tidak boleh kosong') }
      hasError = true;
    }

    this.setState({
      ...errorStates,
      isUpdatePasswordLoading: !hasError,
      isUpdatePasswordError: null,
    });
    if (hasError) {
      return;
    }

    try {

      // make the request
      const resp = await axios.post(endpointURL, {
        query: `
        mutation updatePassword($currentPassword:String!, $newPassword:String!){
          updatePassword(oldPassword:$currentPassword, newPassword:$newPassword){
            message
          }
        }`,
        variables: {
          currentPassword,
          newPassword,
        },
        operationName: "updatePassword",
      })

      const updatePasswordResp = resp.data.data.updatePassword;
      if (updatePasswordResp) {
        this.props.enqueueSnackbar('Password successfully changed', { variant: 'success' });
        this.setState({
          isUpdatePasswordLoading: false,
          currentPassword: '',
          newPassword: '',
          retypePassword: '',
        })
        return
      }
      throw new Error(resp.data.errors[0].message);
    } catch (error) {
      this.props.enqueueSnackbar('Error when changing password: ' + error.message, { variant: 'error' });
      console.log('error happen: ' + error);
      this.setState({
        isUpdatePasswordLoading: false,
        isUpdatePasswordError: error,
      })
    }

  }


  render() {

    return (
      <div className={style.container}>
        <h1>Profil</h1>
        {!this.state.isPageLoading ?
          <div className="opening-transition">
            <form onSubmit={this.onSave} >

              <Input
                type="text"
                label="Name"
                fullWidth
                helperText={this.state.nameErr ? this.state.nameErr.message : ''}
                error={this.state.nameErr != null}
                value={this.state.name}
                onChange={this.handleChange('name')}
                disabled={this.state.isUpdateProfileLoading}
              />

              <Input
                type="text"
                label="Email"
                fullWidth
                value={this.state.email}
                onChange={this.handleChange('email')}
                disabled
              />

              {/* {this.state.isUpdateProfileError ? <div className="error">{this.state.isUpdateProfileError.message}</div> : ''} */}

              <div className={style['button-wrapper']}>
                <Button size="large" variant="outlined" color="primary" type="submit">
                  Save
                          <Icon style={{ fontSize: 20, marginLeft: 8 }}>save</Icon>
                </Button>
              </div>
              {this.state.isUpdateProfileLoading ? <Loading /> : ''}
            </form>

            <form onSubmit={this.onUpdatePassword}>
              <h1 className={style['change-password-title']} style={{ marginTop: 40 }}>Change Password</h1>
              <Input
                type="password"
                label="Current Password"
                disabled={this.state.isUpdatePasswordLoading}
                fullWidth
                helperText={this.state.currentPasswordErr ? this.state.currentPasswordErr.message : ''}
                error={this.state.currentPasswordErr != null}
                name="current_password"
                value={this.state.currentPassword}
                onChange={this.handleChange('currentPassword')}
              />
              <Input
                type="password"
                label="New Password"
                disabled={this.state.isUpdatePasswordLoading}
                fullWidth
                helperText={this.state.newPasswordErr ? this.state.newPasswordErr.message : ''}
                error={this.state.newPasswordErr != null}
                name="new_password"
                value={this.state.newPassword}
                onChange={this.handleChange('newPassword')}
              />

              <Input
                type="password"
                label="Retype Password"
                disabled={this.state.isUpdatePasswordLoading}
                fullWidth
                name="retype_password"
                helperText={this.state.retypePasswordErr ? this.state.retypePasswordErr.message : ''}
                error={this.state.retypePasswordErr != null}
                value={this.state.retypePassword}
                onChange={this.handleChange('retypePassword')}
              />

              {/* {this.state.isUpdatePasswordError ? <div className="error">{this.state.isUpdatePasswordError.message}</div> : ''} */}

              <div className={style['button-wrapper']} style={{ marginBottom: 40 }}>
                <Button size="large" variant="outlined" color="primary" type="submit">
                  Change Password
                          <Icon style={{ fontSize: 20, marginLeft: 8 }}>lock</Icon>
                </Button>
              </div>

              {this.state.isUpdatePasswordLoading ? <Loading /> : ''}
            </form>
          </div>
          : <Preloader />
        }
      </div>

    )
  }
}

export default withSnackbar(Profile);