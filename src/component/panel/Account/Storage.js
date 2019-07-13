import React, { Component } from 'react';
import Axios from 'axios';

import { endpointURL, dropboxStorageProvider } from '../../../config';

import style from '../../../css/storage.module.scss';
import Preloader from '../../common/Preloader';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';

function StorageConnection(props) {

  const unauthorized = (
    <div className={style['button-wrapper'] + ' opening-transition'}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {props.logo}
          </div>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={props.onAuthorize}
            size="large">
            Authorize
          <Icon style={{ marginLeft: 8 }}>link</Icon>
          </Button>
        </Grid>
      </Grid>

    </div>
  );

  const authorized = (
    <React.Fragment>
      <div className={style['list-container']}>
        <img src="/img/bcc-logo-vertical-fit.png" alt="Dropbox Avatar" />
        <div className={style.right}>
          <TextField
            value={props.email}
            label="Dropbox Email"
            fullWidth
            disabled
          />
        </div>
        <div className={style.btn}>
          <Button
            color="secondary"
            variant="contained"
            onClick={props.onUnauthorize}
            size="large">
            Unlink
          <Icon style={{ marginLeft: 8 }}>link_off</Icon>
          </Button>
        </div>
      </div>
    </React.Fragment>
  )

  return (
    props.email != null ? authorized : unauthorized
  );
}

class Storage extends Component {

  state = {
    dropboxEmail: null,
    isDropboxLoading: false,

    isPageLoading: true,
  }

  onAuthorizeDropbox() {
    this.setState({ isDropboxLoading: true });

    const { enqueueSnackbar } = this.props;

    let win = window.open(
      `https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=${dropboxStorageProvider.clientId}&redirect_uri=${dropboxStorageProvider.redirectUri}`,
      // 'http://localhost:3000/account/storage/authorize?provider=dropbox#access_token=WKWKWK&token_type=bearer&uid=104613955&account_id=dbid%3AAABzjG2YLydqtZU9fEVJmM-oHmAcN6cLB_w',
      'Authorization',
      `height=400,width=800`
    );

    const checkWinClose = async () => {
      if (!win.closed) {
        setTimeout(checkWinClose, 500);
        return;
      }

      this.setState({ isDropboxLoading: false });
      const dropboxToken = localStorage.getItem('dropbox_token');
      localStorage.removeItem('dropbox_token');

      if (typeof dropboxToken !== 'string' || dropboxToken !== 'OK') {
        enqueueSnackbar('Error when attempting to connect to Dropbox account', { variant: 'error', preventDuplicate: true });
        return;
      }

      enqueueSnackbar('Linked to your Dropbox account', { variant: 'success', preventDuplicate: true });

      // refresh me query and set dropboxEmail state from backend
      try {
        this.setState({ isPageLoading: true });
        await this.fetchUserStorageProvider();
      } catch (error) {
        this.props.enqueueSnackbar('Unable to fetch user info', { variant: 'error', preventDuplicate: true });
      } finally {
        this.setState({ isPageLoading: false });
      }
    }
    checkWinClose();
  }

  async onUnauthorizeDropbox() {

    try {
      this.setState({ isPageLoading: true });
      const disconnectStorageProviderResp = await this.disconnectStorageProvider();
      this.props.enqueueSnackbar(disconnectStorageProviderResp.message, { variant: 'success', preventDefault: true });
      await this.fetchUserStorageProvider();
    } catch (error) {
      this.props.enqueueSnackbar('Error when unlinking storage provider', { variant: 'error', preventDuplicate: true });
    } finally {
      this.setState({ isPageLoading: false });
    }
  }

  async fetchUserStorageProvider() {
    const resp = await Axios.post(endpointURL, {
      query: `
        query {
          me {
            email
            dropboxAuthorized
            dropboxEmail
          }
        }`
    });
    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }
    const { dropboxEmail, dropboxAuthorized } = resp.data.data.me;
    this.setState({ dropboxEmail });
    return resp.data.data.me;
  }

  async disconnectStorageProvider() {

    const resp = await Axios.post(endpointURL, {
      query: `
          mutation disconnectStorageProvider(){
            disconnectStorageProvider(providerKey: 12345678){
              message
            }
          }`,
      variables: {},
      operationName: "disconnectStorageProvider",
    })

    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }

    const disconnectStorageProviderResp = resp.data.data.disconnectStorageProvider;
    return disconnectStorageProviderResp;
  }

  async componentDidMount() {
    try {
      this.setState({ isPageLoading: true });
      await this.fetchUserStorageProvider();
    } catch (error) {
      this.props.enqueueSnackbar('Unable to fetch user info', { variant: 'error', preventDuplicate: true });
    } finally {
      this.setState({ isPageLoading: false });
    }
  }

  render() {

    return (
      <div className={style.container}>
        <h1>Koneksi</h1>
        {this.state.isPageLoading ? <Preloader /> : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {this.state.isDropboxLoading ? (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <CircularProgress variant="indeterminate" color="primary" />
                </div>
              ) : (
                  <StorageConnection
                    email={this.state.dropboxEmail}
                    logo={<img src="/img/dropbox-logo-sm.png" alt="Dropbox" />}
                    onAuthorize={this.onAuthorizeDropbox.bind(this)}
                    onUnauthorize={this.onUnauthorizeDropbox.bind(this)}
                  />
                )}

            </Grid>
          </Grid>
        )}
      </div >
    );
  }
}

export default withSnackbar(Storage);