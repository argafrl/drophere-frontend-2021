import React from 'react';
import Axios from 'axios';

import { endpointURL, storageProviders } from '../../../config';

const SUPPORTED_PROVIDERS = storageProviders.map(storageProvider => storageProvider.id);

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

const connectStorageProvider = async (providerId, token, successCallbackFn) => {
  // Send Token to Backend
  const resp = await Axios.post(endpointURL, {
    query: `
      mutation connectStorageProvider($providerId:Int!, $token:String!){
        connectStorageProvider(providerId: $providerId, providerToken:$token){
          message
        }
      }`,
    variables: {
      providerId,
      token,
    },
    operationName: "connectStorageProvider",
  })

  if (resp.data.errors) {
    localStorage.setItem(`storage_provider_error`, resp.data.errors[0].message);
    localStorage.setItem('storage_provider_status', 'ERROR');
    return;
  }

  // const connectStorageProviderResp = resp.data.data.connectStorageProvider;
  localStorage.setItem('storage_provider_status', 'OK');

  if (typeof successCallbackFn === 'function') {
    successCallbackFn();
  }

}

const Authorization = props => {
  const queries = new URLSearchParams(props.location.search);
  const hash = props.location.hash;

  const providerId = parseInt(queries.get('providerId'));
  if (!queries.has('providerId') ||
    isNaN(queries.get('providerId')) ||
    !SUPPORTED_PROVIDERS.includes(providerId)) {
    return <React.Fragment>INVALID PROVIDER</React.Fragment>;
  }
  if (typeof hash !== 'string' || hash.indexOf('#') < 0) {
    return <React.Fragment>INVALID URL</React.Fragment>;
  }

  const oauthParams = getParams(hash.split('#')[1]);
  if (typeof oauthParams.error === 'string' && oauthParams.error.length > 0) {
    let errorMsg = oauthParams.error;
    if (typeof oauthParams.error_description === 'string' && oauthParams.error_description.length > 0) {
      errorMsg = oauthParams.error_description;
    }

    return (<React.Fragment>{errorMsg}</React.Fragment>);
  }

  connectStorageProvider(providerId, oauthParams.access_token, window.close);
  // console.log(oauthParams);
  // window.close();
  return (<React.Fragment>OK</React.Fragment>);
}

export default Authorization;