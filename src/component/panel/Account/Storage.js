import React, { Component } from 'react';
import Axios from 'axios';

import {
  endpointURL,
  storageProviders
} from '../../../config';

import style from '../../../css/storage.module.scss';
import Preloader from '../../common/Preloader';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';

function StorageConnection(props) {

  const unauthorized = (
    <div className={style['list-container'] + ' opening-transition'}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {props.logo}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              color="primary"
              fullWidth
              variant="contained"
              onClick={props.onAuthorize}
              size="large">
              Authorize
          <Icon style={{ marginLeft: 8 }}>link</Icon>
            </Button>
          </div>

        </Grid>
      </Grid>

    </div>
  );

  const authorized = (
    <React.Fragment>
      <div className={style['list-container']}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            {
              typeof props.photo === 'string' && props.photo.length > 0 ? (
                <Avatar
                  src={props.photo}
                  alt={`${props.storageProvider.name} Avatar`} />
              ) : (
                  <Avatar
                    alt={`${props.storageProvider.name} Avatar`}>X</Avatar>
                )
            }
          </Grid>
          <Grid item xs={8}>
            <TextField
              value={props.email}
              label={`${props.storageProvider.name} Email`}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <Button
            fullWidth
              color="secondary"
              variant="contained"
              onClick={props.onUnauthorize}
              size="large">
              Unlink
          <Icon style={{ marginLeft: 8 }}>link_off</Icon>
            </Button>
          </Grid>
        </Grid>

      </div>
    </React.Fragment>
  )

  return (
    props.email != null ? authorized : unauthorized
  );
}

class Storage extends Component {

  state = {
    connectedStorageProviders: [],
    dropboxEmail: null,
    isDropboxLoading: false,

    isPageLoading: true,
  }

  onAuthorizeStorageProvider(providerId) {
    return () => {
      this.setState({ isDropboxLoading: true });

      const { enqueueSnackbar } = this.props;
      const storageProvider = storageProviders.find(sp => sp.id === providerId);
      if (storageProvider === null || storageProvider === undefined) {
        enqueueSnackbar("Unknown Storage Provider", { variant: 'error', preventDuplicate: true });
        return;
      }

      let win = window.open(
        storageProvider.authorizationUrl,
        'Authorization',
        `height=400,width=800`
      );

      const checkWinClose = async () => {
        if (!win.closed) {
          setTimeout(checkWinClose, 500);
          return;
        }

        this.setState({ isDropboxLoading: false });
        const storageProviderCredential = localStorage.getItem('storage_provider_status');
        localStorage.removeItem('storage_provider_status');

        if (typeof storageProviderCredential !== 'string' || storageProviderCredential !== 'OK') {
          let errorMsg = `Error when attempting to connect to ${storageProvider.name} account`;
          const errorMsgDetails = localStorage.getItem('storage_provider_error');
          if (typeof errorMsgDetails === 'string' && errorMsgDetails.length > 0) {
            errorMsg += `: ${errorMsgDetails}`;
          }

          enqueueSnackbar(errorMsg, { variant: 'error', preventDuplicate: true });
          return;
        }

        enqueueSnackbar(`Linked to your ${storageProvider.name} account`, { variant: 'success', preventDuplicate: true });

        // refresh me query
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
  }

  onUnauthorizeStorageProvider(providerId) {
    return async () => {
      try {
        this.setState({ isPageLoading: true });

        const disconnectStorageProviderResp = await this.disconnectStorageProvider(providerId);
        this.props.enqueueSnackbar(disconnectStorageProviderResp.message, { variant: 'success', preventDefault: true });
        await this.fetchUserStorageProvider();
      } catch (error) {
        this.props.enqueueSnackbar('Error when unlinking storage provider', { variant: 'error', preventDuplicate: true });
      } finally {
        this.setState({ isPageLoading: false });
      }
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
            connectedStorageProviders {
              id
              providerId
              email
              photo
            }
          }
        }`
    });
    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }
    const { dropboxEmail, connectedStorageProviders } = resp.data.data.me;
    this.setState({ dropboxEmail, connectedStorageProviders });
    return resp.data.data.me;
  }

  async disconnectStorageProvider(providerId) {

    const resp = await Axios.post(endpointURL, {
      query: `
          mutation disconnectStorageProvider($providerId: Int!){
            disconnectStorageProvider(providerId: $providerId){
              message
            }
          }`,
      variables: {
        providerId,
      },
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
        <h1>Tautkan Akun Anda</h1>
        <p>Integrasikan akun anda dengan Cloud Storage</p>
        {this.state.isPageLoading ? <Preloader /> : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {this.state.isDropboxLoading ? (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <CircularProgress variant="indeterminate" color="primary" />
                </div>
              ) : (
                  storageProviders.map(storageProvider => {
                    const connectedStorageProvider = this.state.connectedStorageProviders.find(csp => csp.providerId === storageProvider.id);
                    let email = null;
                    let photo = null;
                    if (connectedStorageProvider !== null && connectedStorageProvider !== undefined) {
                      email = connectedStorageProvider.email;
                      photo = connectedStorageProvider.photo;
                    }
                    return (
                      <StorageConnection
                        email={email}
                        photo={photo}
                        storageProvider={storageProvider}
                        logo={<img src={storageProvider.imageUrl} alt={storageProvider.name} />}
                        onAuthorize={this.onAuthorizeStorageProvider(storageProvider.id)}
                        onUnauthorize={this.onUnauthorizeStorageProvider(storageProvider.id)}
                      />
                    )
                  })
                )}

            </Grid>
          </Grid>
        )}
      </div >
    );
  }
}

export default withSnackbar(Storage);