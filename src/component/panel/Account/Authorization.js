import React from 'react';
import Axios from 'axios';

import { endpointURL } from '../../../config';

const SUPPORTED_PROVIDERS = [
  'dropbox',
  // 'google_drive',
];

function getParams(query) {

  let result = {};
  query.split("&").forEach(function (part) {
    if (!part) return;
    part = part.split("+").join(" "); // replace every + with space, regexp-free version
    let eq = part.indexOf("=");
    let key = eq > -1 ? part.substr(0, eq) : part;
    let val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
    let from = key.indexOf("[");
    if (from === -1) result[decodeURIComponent(key)] = val;
    else {
      let to = key.indexOf("]", from);
      let index = decodeURIComponent(key.substring(from + 1, to));
      key = decodeURIComponent(key.substring(0, from));
      if (!result[key]) result[key] = [];
      if (!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}

const updateDropboxToken = async (token, successCallbackFn) => {
  // Send Dropbox Token to Backend
  const resp = await Axios.post(endpointURL, {
    query: `
      mutation connectStorageProvider($token:String!){
        connectStorageProvider(providerKey: 12345678, providerToken:$token){
          message
        }
      }`,
    variables: {
      token,
    },
    operationName: "connectStorageProvider",
  })

  if (resp.data.errors) {
    localStorage.removeItem('dropbox_token');
    return;
  }

  // const updateDropboxTokenResp = resp.data.data.connectStorageProvider;
  localStorage.setItem('dropbox_token', 'OK');

  if (typeof successCallbackFn === 'function') {
    successCallbackFn();
  }

}

const Authorization = props => {
  const queries = new URLSearchParams(props.location.search);
  const hash = props.location.hash;

  if (!queries.has('provider') || !SUPPORTED_PROVIDERS.includes(queries.get('provider'))) {
    return <React.Fragment>INVALID PROVIDER</React.Fragment>;
  }
  if (typeof hash !== 'string' || hash.indexOf('#') < 0) {
    return <React.Fragment>INVALID URL</React.Fragment>;
  }

  const oauthParams = getParams(hash.split('#')[1]);
  updateDropboxToken(oauthParams.access_token, window.close);
  // console.log(oauthParams);
  // window.close();
  return (<React.Fragment>OK</React.Fragment>);
}

export default Authorization;