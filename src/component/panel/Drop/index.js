import React, { Component } from 'react';
import Axios from 'axios';
import Moment from 'moment';

import { endpointURL, uploadURL } from '../../../config';

import style from '../../../css/account.module.scss';
import dropFileStyle from '../../../css/drop-file.module.scss';
import dropContentStyle from '../../../css/drop-content.module.scss';

import Footer from '../../common/Footer';
import Header from '../../common/Header';
import Loading from '../../common/Loading';

import FileItem from './FileItem';
import Sponsor from './Sponsor';

import {
  Icon,
  IconButton,
  InputAdornment,
  SvgIcon,
  TextField
} from '@material-ui/core';
import { withSnackbar } from 'notistack';

const LinkHeaderContainer = props => {
  let deadline = props.deadline !== null ? Moment(props.deadline) : null;
  return (
    <div className={dropFileStyle.container}>
      <h1 className={dropFileStyle.title}>{props.title}</h1>
      <h2 className={dropFileStyle.subtitle}>{props.subtitle}</h2>
      {deadline !== null ? (
        <span className={dropFileStyle['time-limit']}>Tautan akan ditutup pada : {deadline.format('DD MMMM YYYY')} pukul {deadline.format('HH:mm')} WIB</span>
      ) : ''}
      {props.children}
    </div>
  );
}
class Drop extends Component {

  state = {
    link: null,
    isPageLoading: true,
    isUnlocked: false,

    isUploadHandlerBound: false,

    file: null,
    isUploadFailed: false,
    isUploading: false,
    password: '',
    uploadProgress: 0,
  }

  constructor(props) {
    super(props);

    this.dragDropFileRef = React.createRef();
    this.pickFileRef = React.createRef();
  }

  fetchLink = async (slug, doNotSetState) => {
    const resp = await Axios.post(endpointURL, {
      query: `
        query {
          link (slug: "${slug}") {
            id
            title
            isProtected
            slug
            description
            deadline
            storageProvider {
              id
              providerId
            }
          }
        }`
    })
    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }

    if (!doNotSetState) {
      this.setState({
        link: resp.data.data.link,
      })
    }

    return resp.data.data.link;
  }

  checkLinkPassword = async (linkId, password) => {
    const resp = await Axios.post(endpointURL, {
      query: `
        mutation checkLinkPassword($linkId:Int!, $password:String!){
          checkLinkPassword(linkId:$linkId, password:$password){
            message
          }
        }`,
      variables: {
        linkId,
        password,
      },
      operationName: 'checkLinkPassword'
    })

    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }

    const checkLinkPasswordResp = resp.data.data.checkLinkPassword
    if (checkLinkPasswordResp.message === 'Valid Password') {
      return true
    }
    return false
  }

  handlePickedFile = async (file) => {
    try {
      this.setState({
        file,
        uploadProgress: 0,
        isUploading: true,
        isUploadFailed: false,
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('linkId', this.state.link.id);
      formData.append('password', this.state.password);
      const resp = await Axios.post(uploadURL, formData, {
        onUploadProgress: (progressEvent) => {
          let percentCompleted = (progressEvent.loaded / progressEvent.total);
          this.setState({
            uploadProgress: percentCompleted
          });
        }
      })

      if (resp.data.errors) {
        throw new Error(resp.data.errors[0].message);
      }

      this.setState({ isUploading: false })
      this.props.enqueueSnackbar('File successfully uploaded', { variant: 'success', preventDuplicate: true });
    } catch (error) {
      this.setState({ isUploading: false, isUploadFailed: true });
      this.props.enqueueSnackbar('Error when uploading file: ' + error.message, { variant: 'error', preventDuplicate: true });
    }
  }

  onChangeHandler = name => {
    return event => {
      this.setState({ [name]: event.target.value })
    }
  }

  onSubmitPassword = async (event) => {
    event.preventDefault();

    const isUnlocked = await this.checkLinkPassword(this.state.link.id, this.state.password);
    if (!isUnlocked) {
      this.props.enqueueSnackbar('You entered the wrong password', { variant: 'warning', preventDuplicate: true })
    }
    this.setState({
      isUnlocked
    })
  }

  async componentDidMount() {
    try {
      // fetch link
      const link = await this.fetchLink(this.props.match.params.slug, true);
      this.setState({
        isPageLoading: false,
        isUnlocked: link !== null && link.isProtected ? false : true,
        link,
      })
    } catch (error) {
      this.props.enqueueSnackbar('Error when fetching link info', { variant: 'error', preventDuplicate: true })
      this.setState({ isPageLoading: false })
    }
  }

  componentDidUpdate() {
    if (!this.state.isUploadHandlerBound && this.pickFileRef.current !== null && this.dragDropFileRef.current !== null) {
      // setup drag & drop
      this.dragDropFileRef.current.ondragenter = event => {
        event.preventDefault();
        this.dragDropFileRef.current.classList.add(dropFileStyle['drop-file-container-ondrag']);
      }
      this.dragDropFileRef.current.ondragover = event => {
        event.preventDefault();
        if (!this.dragDropFileRef.current.classList.contains(dropFileStyle['drop-file-container-ondrag']))
          this.dragDropFileRef.current.classList.add(dropFileStyle['drop-file-container-ondrag']);
      }
      this.dragDropFileRef.current.ondragleave = event => {
        event.preventDefault();
        this.dragDropFileRef.current.classList.remove(dropFileStyle['drop-file-container-ondrag']);
      }
      this.dragDropFileRef.current.ondrop = event => {
        event.preventDefault();
        this.dragDropFileRef.current.classList.remove(dropFileStyle['drop-file-container-ondrag']);
        this.handlePickedFile(event.dataTransfer.files.item(0));
      }
      this.pickFileRef.current.onchange = event => {
        event.preventDefault();
        this.handlePickedFile(event.target.files[0]);
      }

      this.setState({
        isUploadHandlerBound: true,
      });
    }
  }

  renderPasswordBox() {
    return (
      <div className={dropFileStyle['drop-file-container']}>
        <form onSubmit={this.onSubmitPassword}>
          <TextField
            fullWidth
            required
            type="password"
            label="Password"
            placeholder="Enter a password"
            value={this.state.password}
            onChange={this.onChangeHandler('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end">
                    <Icon>keyboard_return</Icon>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </form>
      </div>
    );
  }

  renderDropUploader() {
    let fileUploadProgress;

    if (this.state.file && typeof this.state.file === 'object') {
      fileUploadProgress = <FileItem
        title={this.state.file.name}
        size={this.state.file.size}
        percentage={this.state.uploadProgress}
        isUploading={this.state.isUploading}
        isFailed={this.state.isUploadFailed}
      />
    }
    return (
      <React.Fragment>
        <div className={dropFileStyle['drop-file-container']} ref={this.dragDropFileRef}>
          <span className={dropFileStyle['drop-title']}>TARIK FILE KE SINI</span>
          <span className={dropFileStyle['drop-separator']}>- ATAU -</span>
          <div className={dropFileStyle['upload-file-container']}>
            <label>
              <span className={dropFileStyle['upload-file-button']}>PILIH FILE UNTUK DIUNGGAH</span>
              <input
                type="file"
                ref={this.pickFileRef}
                name="uploadFile"
                id="uploadFile"
                className={dropFileStyle['upload-file']}
                disabled={this.state.isUploading}
              />
            </label>
          </div>
        </div>
        <div className={dropFileStyle['file-list-container']}>
          {fileUploadProgress}
        </div>
      </React.Fragment>
    );
  }

  renderExpiredLink() {
    return (
      <div className={dropFileStyle['drop-file-container']} style={{ color: 'red' }}>
        <div style={{ fontSize: 48 }}>
          <SvgIcon fontSize="inherit">
            <path d="M8.5,2C6,2 4,4 4,6.5V7C2.89,7 2,7.89 2,9V18C2,19.11 2.89,20 4,20H8.72C10.18,21.29 12.06,22 14,22A8,8 0 0,0 22,14A8,8 0 0,0 14,6C13.66,6 13.32,6.03 13,6.08C12.76,3.77 10.82,2 8.5,2M8.5,4A2.5,2.5 0 0,1 11,6.5V7H6V6.5A2.5,2.5 0 0,1 8.5,4M14,8A6,6 0 0,1 20,14A6,6 0 0,1 14,20A6,6 0 0,1 8,14A6,6 0 0,1 14,8M13,10V15L16.64,17.19L17.42,15.9L14.5,14.15V10H13Z" />
          </SvgIcon>
        </div>
        <h1 className={dropFileStyle.title}>
          Link is expired
        </h1>
      </div>
    );
  }

  renderContainer() {
    if (this.state.isPageLoading) {
      return <Loading circular />;
    }

    if (this.state.link !== null) {
      let deadline = null;

      if (this.state.link !== null && this.state.link.deadline !== null) {
        deadline = Moment(this.state.link.deadline);
        if (!deadline.isValid()) {
          deadline = null;
        }
      }

      let container = null;
      if (this.state.link.storageProvider === null || this.state.link.storageProvider === undefined) {
        container = (
          <div className={dropFileStyle['drop-file-container']} style={{ color: 'red' }}>
            <div style={{ fontSize: 48 }}>
              <Icon fontSize="inherit">cloud_off_outline</Icon>
            </div>
            <h1 className={dropFileStyle.title}>
              Link is not connected to any Storage Provider
        </h1>
          </div>
        );
      } else if (deadline === null || deadline.isAfter(Moment.now())) {
        if (this.state.isUnlocked) {
          container = this.renderDropUploader()
        } else {
          container = this.renderPasswordBox();
        }
      } else {
        container = this.renderExpiredLink();
      }

      return (
        <LinkHeaderContainer
          title={this.state.link.title}
          subtitle={this.state.link.description}
          deadline={this.state.link.deadline}>
          {container}
        </LinkHeaderContainer>
      )
    }

    return <span style={{ textAlign: 'center', fontSize: '20pt', fontWeight: 100 }}>- 404 NOT FOUND -</span>;
  }

  render() {
    return (
      <div className={style.container} style={{ height: '100%' }}>
        <div className={style.header}>
          <Header />
        </div>

        <div style={{ height: '67%' }}>
          <div className={dropContentStyle.container + ' wrapper'}>
            <div className={dropContentStyle.content}>
              {this.renderContainer()}
            </div>
          </div>
        </div>


        {/* <div className={dropFileStyle['sponsor-container']} style={{ width: '81%', margin: '10px auto 0px auto' }}>
          <Sponsor />
        </div> */}

        <Footer />
      </div>
    )
  }
}

export default withSnackbar(Drop);