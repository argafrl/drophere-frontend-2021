import React, { Component, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSnackbar } from 'notistack';

import style from '../../../css/pages.module.scss';
import editPageStyle from '../../../css/edit-page.module.scss';
import {
  defaultStorageProviderId,
  endpointURL,
  excludeSlug,
  linkPrefix,
  storageProviders,
} from '../../../config';

import Loading from '../../common/Loading';

import {
  Button,
  Collapse,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Fab,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Icon,
  Input,
  InputAdornment,
  InputLabel,
  NativeSelect,
  Paper,
  Switch,
  TextField
} from '@material-ui/core';

import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MomentUtils from '@date-io/moment';
import { withSnackbar } from 'notistack';

const excludeSlugRegexp = new RegExp('^(' + excludeSlug.join('|') + ')$');

function EditForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  let storageProviderId = 0;
  let defaultStorageProviderId = 0;
  if (typeof props.defaultStorageProviderId === 'number' && props.defaultStorageProviderId > 0) {
    defaultStorageProviderId = parseInt(props.defaultStorageProviderId)
    storageProviderId = defaultStorageProviderId
  }
  if (props.storageProvider !== null &&
    props.storageProvider !== undefined &&
    typeof props.storageProvider.providerId === 'number'
  ) {
    storageProviderId = props.storageProvider.providerId
  }
  const [state, setState] = useState({
    slug: props.slug || '',
    title: props.title || '',
    usePassword: props.isProtected || false,
    password: '',
    description: props.description || '',
    useDeadline: props.deadline != null,
    deadlineDate: props.deadline != null ? moment(props.deadline) : moment(),
    storageProviderId: storageProviderId,

    isSlugError: false
  })

  const disableDelete = typeof props.disableDelete === 'boolean' ? props.disableDelete : false;
  const resetOnSave = typeof props.resetOnSave === 'boolean' ? props.resetOnSave : false;
  const supportedStorageProviders = Array.isArray(props.supportedStorageProviders) ? props.supportedStorageProviders : [];

  const onChangeHandler = name => {
    return event => {
      setState({ ...state, [name]: event.target.value })
    }
  }

  const onCheckedHandler = name => {
    return event => {
      setState({ ...state, [name]: event.target.checked })
    }
  }

  const onDeleteHandler = () => {
    if (typeof props.onDelete === 'function') {
      props.onDelete();
    }
  }

  const onSaveHandler = (event) => {
    event.preventDefault();

    if (state.isSlugError) {
      enqueueSnackbar('Please check your input link', {
        key: 'error-slug',
        preventDuplicate: true,
        variant: 'error'
      });
      return;
    }

    if (typeof props.onSave === 'function') {
      props.onSave(state)
    }

    if (resetOnSave) {
      setState({
        isSlugError: false,
        slug: props.slug || '',
        title: props.title || '',
        usePassword: props.isProtected || false,
        password: '',
        description: props.description || '',
        useDeadline: props.deadline != null,
        deadlineDate: props.deadline != null ? moment(props.deadline) : moment(),
        storageProviderId: defaultStorageProviderId,
      })
    }
  }

  const onSlugChangeHandler = event => {
    const re = /[^A-Za-z0-9-_]/g;
    let slug = event.target.value;
    if (typeof slug !== 'string') {
      return;
    }

    const hasInvalidKeyword = excludeSlugRegexp.test(slug);
    slug = slug.replace(re, '');

    setState({
      ...state,
      slug,
      isSlugError: hasInvalidKeyword,
    })
  }

  return (
    <div className={editPageStyle.container}>
      <form onSubmit={onSaveHandler}>
        <TextField
          fullWidth
          type="text"
          label="Halaman"
          value={state.slug}
          helperText={(
            <FormHelperText>
              Allowed Characters: alphabets, numbers, dash, and underscore.<br />
              Prohibited slug: {excludeSlug.join(', ')}
            </FormHelperText>
          )}
          error={state.isSlugError}
          onChange={onSlugChangeHandler}
          InputProps={{
            startAdornment: <InputAdornment position="start">{typeof linkPrefix === 'string' && linkPrefix.length > 0 ? linkPrefix : 'https://drophere.link/'}</InputAdornment>
          }}
          required
        />

        <FormControlLabel
          value="usePassword"
          control={
            <Switch
              checked={state.usePassword}
              onChange={onCheckedHandler('usePassword')}
              color="primary"
            />
          }
          label="Use Password"
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={state.password}
          placeholder={props.isProtected ? "(unchanged)" : "Set a password"}
          required={!props.isProtected} // required if previously it is not protected
          onChange={onChangeHandler('password')}
          disabled={!state.usePassword}
        />

        <TextField
          fullWidth
          type="text"
          label="Judul"
          value={state.title}
          onChange={onChangeHandler('title')}
          required
        />

        <TextField
          fullWidth
          type="text"
          label="Deskripsi"
          value={state.description}
          onChange={onChangeHandler('description')}
        />

        <FormControlLabel
          value="deadline"
          control={
            <Switch
              checked={state.useDeadline}
              onChange={onCheckedHandler('useDeadline')}
              color="primary"
            />
          }
          label="Set Deadline"
        />


        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            margin="normal"
            label="Deadline"
            ampm={false}
            disablePast={!true}
            format="D MMMM YYYY @ HH:mm"
            value={state.deadlineDate}
            onChange={v => { setState({ ...state, deadlineDate: v }) }}
            fullWidth
            disabled={!state.useDeadline}
          />

        </MuiPickersUtilsProvider>

        <FormControl fullWidth>
          <InputLabel shrink>
            Storage Provider
          </InputLabel>

          <NativeSelect
            input={<Input />}
            onChange={(event) => {
              setState({ ...state, storageProviderId: Number(event.target.value) })
            }}
            value={state.storageProviderId}>
            <option value="">none</option>
            {
              supportedStorageProviders.map(storageProvider => (
                <option value={storageProvider.id}>{storageProvider.name}</option>
              ))
            }
          </NativeSelect>
        </FormControl>

        <div className={editPageStyle['button-group']}>
          {disableDelete ? '' : (
            <Button variant="text" color="secondary" onClick={onDeleteHandler}>
              <span style={{ marginRight: 4 }}>Hapus</span>
              <Icon>delete</Icon>
            </Button>
          )}
          <Button variant="text" color="primary" type="submit">
            <span style={{ marginRight: 4 }}>Simpan</span>
            <Icon>save</Icon>
          </Button>
        </div>
      </form>
    </div>

  );
}

class Pages extends Component {

  state = {
    connectedStorageProviders: null,
    links: [],
    newLink: {
      title: '',
      slug: '',
      description: '',
      deadline: null,
      isProtected: false,
    },

    error: null,
    success: null,

    isLinksLoading: false,
    showAdd: false,
  };

  fetchUserConnectedStorageProviders = async () => {
    const resp = await axios.post(endpointURL, {
      query: `
      query {
        me {
          connectedStorageProviders {
            id
            providerId
          }
        }
      }`
    })
    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }

    const meResp = resp.data.data.me;
    let connectedStorageProviders = [];
    if (meResp) {
      if (Array.isArray(meResp.connectedStorageProviders)) {
        // cross filter with storageProviders
        meResp.connectedStorageProviders.forEach(csp => {
          storageProviders.forEach(sp => {
            if (csp.providerId === sp.id) {
              connectedStorageProviders.push(sp);
            }
          })
        })
      }
    }
    this.setState({
      connectedStorageProviders: connectedStorageProviders
    })
  }

  reloadLinks = async () => {
    const resp = await axios.post(endpointURL, {
      query: `
        query{
          links{
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

    this.setState({
      links: resp.data.data.links,
      isLinksLoading: false,

    });

  }

  createLink = async ({ title, slug, description, deadline, password, storageProviderId }) => {

    const resp = await axios.post(endpointURL, {
      query: `
        mutation createLink($title:String!, $slug:String!, $description:String, $deadline:Time, $password:String, $storageProviderId:Int){
          createLink(title:$title, slug:$slug, description:$description, deadline:$deadline, password:$password, providerId:$storageProviderId){
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
        }`,
      variables: {
        title,
        slug,
        description,
        deadline,
        password,
        storageProviderId,
      },
      operationName: 'createLink'
    })

    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }
    // const createLinkResp = resp.data.data.createLink;
    this.setState({
      showAdd: false,
    })
  }

  updateLink = async ({ id: linkId, title, slug, description, deadline, password, storageProviderId }) => {

    const resp = await axios.post(endpointURL, {
      query: `
        mutation updateLink($linkId:Int!, $title:String!, $slug:String!, $description:String, $deadline:Time, $password:String, $storageProviderId:Int){
          updateLink(linkId:$linkId, title:$title, slug:$slug, description:$description, deadline:$deadline, password:$password, providerId:$storageProviderId){
            id
          }
        }`,
      variables: {
        linkId,
        title,
        slug,
        description,
        deadline,
        password,
        storageProviderId,
      },
      operationName: 'updateLink'
    })

    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }

    // const updateLinkResp = resp.data.data.updateLink;
    // console.log('message: ' + updateLinkResp.message);
  }

  deleteLink = async ({ linkId }) => {

    const resp = await axios.post(endpointURL, {
      query: `
        mutation deleteLink($linkId:Int!){
          deleteLink(linkId:$linkId){
            message
          }
        }`,
      variables: {
        linkId,
      },
      operationName: 'deleteLink'
    })

    if (resp.data.errors) {
      throw new Error(resp.data.errors[0].message);
    }

    const deleteLinkResp = resp.data.data.deleteLink;
    console.log('message: ' + deleteLinkResp.message);
  }

  onDeleteHandler = linkIdx => {
    return async () => {
      // console.log(this.state.links[linkIdx].id + ' is being deleted');
      try {
        this.setState({ isLinksLoading: true })
        await this.deleteLink({ linkId: this.state.links[linkIdx].id });
        await this.reloadLinks();
        this.props.enqueueSnackbar('Link deleted', { variant: 'info' });
      } catch (error) {
        console.log('error happen: ' + error);
        this.props.enqueueSnackbar('Error when deleting link', { variant: 'error' });
        this.setState({
          error,
          isLinksLoading: false
        })
      }
    }
  }

  onSaveHandler = linkIdx => {
    return async (newData) => {

      const link = {
        ...this.state.links[linkIdx],
        title: newData.title,
        slug: newData.slug,
        description: newData.description,
        password: null,
        deadline: null,
        storageProviderId: newData.storageProviderId,
      }

      if (newData.usePassword) {
        if (newData.password.length > 0) {
          link.password = newData.password;
        }
      } else {
        if (link.isProtected) {
          link.password = ""
        }
      }

      if (newData.useDeadline) {
        link.deadline = newData.deadlineDate.toISOString()
      }
      try {
        this.setState({ isLinksLoading: true })
        await this.updateLink(link);
        await this.reloadLinks();
        this.props.enqueueSnackbar('Link saved', { variant: 'success' });
      } catch (error) {
        this.props.enqueueSnackbar('Error when saving link', { variant: 'error' });
        console.log('error happen: ' + error);
        this.setState({
          error,
          isLinksLoading: false
        })
      }
    }
  }

  onCreateHandler = async (newData) => {
    const link = {
      ...this.state.newLink,
      title: newData.title,
      slug: newData.slug,
      description: newData.description,
      password: null,
      deadline: null,
      storageProviderId: newData.storageProviderId,
    }
    console.log('debug: link: ', link);
    console.log('debug: new data: ', newData);

    if (newData.usePassword) {
      if (newData.password.length > 0) {
        link.password = newData.password;
      }
    } else {
      if (link.isProtected) {
        link.password = ""
      }
    }

    if (newData.useDeadline) {
      link.deadline = newData.deadlineDate.toISOString()
    }
    try {
      this.setState({ isLinksLoading: true })
      await this.createLink(link);
      await this.reloadLinks();
      this.props.enqueueSnackbar('Link successfully created', { variant: 'success' });
    } catch (error) {
      this.props.enqueueSnackbar('Error when creating new link: ' + error.message, { variant: 'error' });
      console.log('error happen: ' + error);
      this.setState({
        error,
        isLinksLoading: false
      })
    }
  }

  async componentDidMount() {
    try {
      this.setState({ isLinksLoading: true })
      await Promise.all([
        this.fetchUserConnectedStorageProviders(),
        this.reloadLinks()
      ])
      this.setState({ isLinksLoading: false })
    } catch (error) {
      this.props.enqueueSnackbar('Error when loading links', { variant: 'error' });
      console.log('error happen: ' + error);
      this.setState({
        error,
        isLinksLoading: false,
      })
    }
  }

  render() {

    return (
      <div className={style.container}>
        {this.state.isLinksLoading ? <Loading /> : ''}

        <Grid container spacing={4}>
          <Grid item xs>
            <h1>Halaman</h1>
          </Grid>
          <Grid item xs style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Fab
              size="small"
              variant="extended"
              onClick={() => { this.setState({ showAdd: !this.state.showAdd }) }}
              color="primary">
              <Icon>add</Icon>
              Buat
            </Fab>
          </Grid>
        </Grid>

        {/* {this.state.error !== null ? <div className="error">{this.state.error.message}</div> : ''} */}


        <Collapse in={this.state.showAdd}>
          <Paper square style={{ padding: 24 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <h2>Halaman Baru</h2>
              </Grid>
              <Grid item xs={12}>
                <EditForm
                  disableDelete
                  resetOnSave
                  defaultStorageProviderId={defaultStorageProviderId}
                  supportedStorageProviders={this.state.connectedStorageProviders}
                  {...this.state.newLink}
                  onSave={this.onCreateHandler}
                />
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {this.state.links.length <= 0 ? '' : this.state.links.map((link, linkIdx) => {
          return (
            <ExpansionPanel key={'link' + linkIdx}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                {`${typeof linkPrefix === 'string' && linkPrefix.length > 0 ? linkPrefix : 'https://drophere.link/'}${link.slug}`}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <EditForm
                  supportedStorageProviders={this.state.connectedStorageProviders}
                  {...link}
                  onDelete={this.onDeleteHandler(linkIdx)}
                  onSave={this.onSaveHandler(linkIdx)}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  }
}

export default withSnackbar(Pages);