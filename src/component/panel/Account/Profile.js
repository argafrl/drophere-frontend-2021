import React, { Component } from 'react';
import axios from 'axios';

// import { TokenContext } from '../../../contexts/token';
import { endpointURL } from '../../../config';

import style from '../../../css/account-profile.module.scss';
// import Input from '../../common/WrappedInput';
import Loading from '../../common/Loading';
import Preloader from '../../common/Preloader';

import {useDropzone} from 'react-dropzone';

// import Button from '@material-ui/core/Button';

import { Input, Button } from '@bccfilkom/designsystem/build'

import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';

import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import mainApi from '../../../api/mainApi';

function Dropzone() {
  const {getRootProps, getInputProps, open, acceptedFiles, fileRejections} = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    maxFiles:1,
    noDrag: true,
    accept: 'image/jpeg, image/png'
  });

  const acceptedFileItems  = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path}
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors  }) => { 
    return (
      <li key={file.path}>
           {file.path}
           <ul>
             {errors.map(e => <li key={e.code}>{e.message}</li>)}
          </ul>
          {/* {errors.message} */}
      </li>
    ) 
   });

  return (
    <div className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <Button type="prmary" onClick={open}>
          <CameraAltOutlinedIcon />Ubah
        </Button>
      </div>
      <aside>
        {/* <h4>Files</h4> */}
        {/* <ul>{acceptedFileItems }</ul> */}
        {/* <ul>{fileRejectionItems}</ul> */}
      </aside>
    </div>
  );
}

class Profile extends Component {

  static contextType = UserContext;

  state = {
    openNama: false,
    openPassword: false,

    verifikasi: false,

    name: '',
    email: '',
    profile_image:'',

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

  handleClickOpenNama = () => {
    this.setState({
      openNama: !this.state.openNama
    })
  }

  handleClickOpenPassword = () => {
    this.setState({
      openPassword: !this.state.openPassword
    })
  }

  handleVerifikasi = () => {
    this.setState({
      verifikasi: !this.state.verifikasi
    })
  }

  async componentDidMount() {
    try {
      this.context.fetchUserInfo();
      this.setState({
        name: this.context.full_name,
        email: this.context.email,
        profile_image: this.context.profile_image
      });
      // const { name, email } = resp.data.data.me;
      // this.setState({ name, email, isPageLoading: false });

      // const resp = await axios.post(endpointURL, {
      //   query: `
      //   query {
      //     me {
      //       email
      //       name
      //     }
      //   }`
      // })
      // if (resp.data.errors) {
      //   throw new Error(resp.data.errors[0].message);
      // }

      // const { name, email } = resp.data.data.me;
      // this.setState({ name, email, isPageLoading: false });
    } catch (error) {
      // this.props.enqueueSnackbar('Error when fetching user profile', { variant: 'error' });
      // this.setState({ isPageLoading: false });
      // this.context.setToken('');
      // this.props.history.push('/home');
    }
  }

  onUpdateProfile = async (e) => {
    e.preventDefault();
    console.log('a')
    try{
      const bodyFormData = new FormData();
      bodyFormData.append("profile_image", this.state.profile_image);
      bodyFormData.append("full_name", this.state.full_name);
      bodyFormData.append("email", this.state.email);
      
      await mainApi.patch("/users/profile", bodyFormData, {
        headers: {
          Authorization: localStorage.getItem("bccdrophere_token"),
          "Content-Type": "multipart/form-data"
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  // async componentDidUpdate() {
  //   this.context.fetchUserInfo();
  //   this.setState({
  //     name: this.context.full_name,
  //   });
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
        <h1>Profile</h1>
        <p>Info dasar, seperti nama, email, dan foto yang Anda gunakan</p>
        {!this.state.isPageLoading ?
          <div className="opening-transition">
            <div className={style['form-wrapper']}>
              

                <div className={style['form-container']} style={{borderTop: "none"}}>
                  <div className={style['form-unedit']}>

                  <div className={style.left}>
                      <p>Foto</p>
                    </div>
                    
                    <div className={style.middle}>
                      <Avatar alt="Travis Howard" src={this.state.profile_image} className={style.avatar} />
                        <div className={style['btn-ubah']}>
                          {/* <Button type="primary">
                            <Icon>photo_camera</Icon>Ubah
                            <CameraAltOutlinedIcon />Ubah
                          </Button> */}
                          {/* <Dropzone /> */}
                          <input type="file" name="avatar" id="btn-avatar" accept="image/*" style={{display: "none"}} />
                          <div className={style['btn-avatar-wrapper']}>
                            <label for="btn-avatar"><CameraAltOutlinedIcon />Ubah</label>
                          </div>
                        </div>
                    </div>

                    <div className={style.right}>
                      {/* <Button type="text">
                        <Icon>delete</Icon>Hapus
                      </Button> */}
                      <button
                        type="button"
                        onClick={this.handleClickOpen}
                        className={style["btn-text"]}
                      >
                        <Icon>delete</Icon>Hapus
                      </button>
                    </div>
                    {/* <div className={style['form-text']}>
                      <p>Foto</p>
                      <div className={style['form-input']}>
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" className={style.avatar} />
                        <div className={style['btn-ubah']}>
                          <Button type="primary">
                            <Icon>photo_camera</Icon>Ubah
                            <CameraAltOutlinedIcon />Ubah
                          </Button>
                          <Dropzone />
                        </div>
                      </div>
                    </div> */}
                    
                    {/* <div className={style['form-action']}>
                      <Button type="text">
                        <Icon>delete</Icon>Hapus
                      </Button>
                    </div> */}
                  </div>
                </div>
                
                <div className={style['form-container']}>
                  {this.state.openNama ? 
                  <form onSubmit={this.onUpdateProfile} className={style['form-edit']}>
                    <div className={style['form-text']}>
                      <p>Nama</p>
                    </div>
                    <div className={style['input-wrapper']}>
                      <Input
                        handleChange={this.handleChange('name')}
                        value={this.state.name}
                        className={style['input']}
                        placeholder="Nama Lengkap"
                        // style={{borderRadius: "8px"}}
                      /> 
                      <div className={style['button-wrapper']}>
                        <Button type="secondary" onClick={this.handleClickOpenNama} className={style['btn-batal']}>
                          Batalkan
                        </Button>
                        <Button size="large" variant="outlined" color="primary" type="submit">
                          Simpan
                          {/* <Icon style={{ fontSize: 20, marginLeft: 8 }}>save</Icon> */}
                        </Button>
                      </div>
                    </div>
                    
                    {this.state.isUpdateProfileLoading ? <Loading /> : ''}
                  </form>
                  : 
                  <div className={style['form-unedit']}>
                    <div className={style.left}>
                      <p>Nama</p>
                    </div>
                    
                    <div className={style.middle}>
                      <p>{this.state.name}</p>
                    </div>

                    <div className={style.right}>
                      {/* <Button type="text" onClick={this.handleClickOpenNama}>
                        <Icon>edit</Icon>Edit
                      </Button> */}
                      <button
                        type="button"
                        onClick={this.handleClickOpenNama}
                        className={style["btn-text"]}
                      >
                        <Icon>edit</Icon>Edit
                      </button>
                    </div>
                    {/* <div className={style['form-text']}>
                      <p>Nama</p>
                      <p>{this.state.name}</p>
                    </div>

                    <div className={style['form-action']}>
                      <Button type="text" onClick={this.handleClickOpenNama}>
                        <Icon>edit</Icon>Edit
                      </Button>
                    </div> */}
                  </div>
                  // <div className={style['form-edit']}>
                  //   <div className={style['form-input']}>
                  //     <p>{this.state.name}</p>
                  //   </div>

                  //   <div className={style['form-action']}>
                  //     <Button type="text" onClick={this.handleClickOpenNama}>
                  //       <Icon>edit</Icon>Edit
                  //     </Button>
                  //   </div>
                  // </div>
                  }              
                </div>
                

                <div className={style['form-container']}>
                  <div className={style['form-unedit']}>
                    <div className={style.left}>
                      <p>Email</p>
                    </div>
                    
                    <div className={style.middle}>
                      <p style={{color: "#05A1D1"}}>{this.state.email}</p>
                      { this.state.email && <div className={style.verifikasi} style={ this.state.verifikasi ? {backgroundColor: "#40C02B"} : {backgroundColor: "#F4B12F"}}>
                        { this.state.verifikasi ? 
                          <p style={{color: "white"}}>Terverifikasi</p>
                          : 
                          <p>Belum terverifikasi. <Link onClick={this.handleVerifikasi}>Kirim ulang</Link></p>
                        }
                      </div>}
                    </div>

                    
                    {/* <div className={style['form-text']}>
                      <p>Email</p>
                      <div className={style['form-input']}>
                        <p style={{color: "#05A1D1"}}>{this.state.email}</p>
                      </div>
                    </div>                 

                    <div className={style['form-action']}>
                      <Button type="text">
                        <Icon>edit</Icon>Edit
                      </Button>
                    </div> */}
                  </div>
                </div>

                
                <div className={style['form-container']}>
                  {this.state.openPassword ? 

                  <form onSubmit={this.onUpdatePassword} className={style['form-edit']}>
                    <div className={style['form-text']} style={{marginTop: "5px"}}>
                      <p>Password</p>
                    </div>
                    <div className={style['input-wrapper']}>
                    {/* <h1 className={style['change-password-title']} style={{ marginTop: 40 }}>Change Password</h1> */}
                      <Input
                        type="password"
                        placeholder="Password lama"
                        disabled={this.state.isUpdatePasswordLoading}
                        // fullWidth
                        hintText={this.state.currentPasswordErr ? this.state.currentPasswordErr.message : ''}
                        error={this.state.currentPasswordErr != null}
                        name="current_password"
                        value={this.state.currentPassword}
                        onChange={this.handleChange('currentPassword')}
                      />
                      <Input
                        type="password"
                        placeholder="Password Baru"
                        disabled={this.state.isUpdatePasswordLoading}
                        // fullWidth
                        hintText={this.state.newPasswordErr ? this.state.newPasswordErr.message : ''}
                        error={this.state.newPasswordErr != null}
                        name="new_password"
                        value={this.state.newPassword}
                        onChange={this.handleChange('newPassword')}
                      />

                      <Input
                        type="password"
                        placeholder="Ulangi Password"
                        disabled={this.state.isUpdatePasswordLoading}
                        // fullWidth
                        name="retype_password"
                        hintText={this.state.retypePasswordErr ? this.state.retypePasswordErr.message : ''}
                        error={this.state.retypePasswordErr != null}
                        value={this.state.retypePassword}
                        onChange={this.handleChange('retypePassword')}
                      />

                    {/* {this.state.isUpdatePasswordError ? <div className="error">{this.state.isUpdatePasswordError.message}</div> : ''} */}

                    <div className={style['button-wrapper']}>
                      <Button type="secondary" onClick={this.handleClickOpenPassword} className={style['btn-batal']}>
                        Batalkan
                      </Button>
                      <Button size="large" variant="outlined" color="primary" type="submit">
                        Simpan
                        {/* <Icon style={{ fontSize: 20, marginLeft: 8 }}>save</Icon> */}
                      </Button>
                      {/* <Button size="large" variant="outlined" color="primary" type="submit">
                        Change Password
                        <Icon style={{ fontSize: 20, marginLeft: 8 }}>lock</Icon>
                      </Button> */}
                    </div>
                    </div>

                    {this.state.isUpdatePasswordLoading ? <Loading /> : ''}
                  </form> 
                  :
                  <div className={style['form-unedit']}>
                    <div className={style.left}>
                      <p>Password</p>
                    </div>
                    
                    <div className={style.middle}>
                      <div className={style['btn-ubah']}>
                        <Button type="primary" onClick={this.handleClickOpenPassword}>
                          <Icon>edit</Icon>Ubah Password
                        </Button>
                      </div>
                    </div>

                    {/* <div className={style['form-text']}>
                      <p>Password</p>
                      <div className={style["btn-ubah"]}>
                      <Button type="primary" onClick={this.handleClickOpenPassword}>
                        <Icon>edit</Icon>Ubah Password
                      </Button>
                      </div>
                    </div>                     */}

                    {/* <div className={style['form-action']}>
                      <Button type="text" onClick={this.handleClickOpenPassword}>
                        <Icon>edit</Icon>Edit
                      </Button>
                    </div> */}
                  </div>
                  }
                </div>

                {/* <Input
                  type="text"
                  label="Name"
                  fullWidth
                  helperText={this.state.nameErr ? this.state.nameErr.message : ''}
                  error={this.state.nameErr != null}
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                  disabled={this.state.isUpdateProfileLoading}
                /> */}

                {/* <Input
                  type="text"
                  label="Email"
                  fullWidth
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                  disabled
                /> */}

                {/* {this.state.isUpdateProfileError ? <div className="error">{this.state.isUpdateProfileError.message}</div> : ''} */}

                

              {/* <form onSubmit={this.onUpdatePassword}>
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

                {this.state.isUpdatePasswordError ? <div className="error">{this.state.isUpdatePasswordError.message}</div> : ''}

                <div className={style['button-wrapper']} style={{ marginBottom: 40 }}>
                  <Button size="large" variant="outlined" color="primary" type="submit">
                    Change Password
                            <Icon style={{ fontSize: 20, marginLeft: 8 }}>lock</Icon>
                  </Button>
                </div>

                {this.state.isUpdatePasswordLoading ? <Loading /> : ''}
              </form> */}
            </div>
          </div>
          : <Preloader />
        }
      </div>

    )
  }
}

export default withSnackbar(Profile);