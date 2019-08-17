export const endpointURL =  'http://localhost:8080/query';
export const uploadURL =  'http://localhost:8080/uploadfile';

export const excludeSlug = [
  'account',
  'home',
  'login',
  'register',
  'recover-password',
];
export const linkPrefix = 'https://drophere.link/';
export const dropboxStorageProvider = {
  redirectUri: 'http://localhost:3000/account/storage/authorize?provider=dropbox',
  clientId: '0ljk1sqdvxnhd3i'
};
export const storageProviders = [
  {
    id: 12345678,
    name: "Dropbox",
    redirectUri: 'http://localhost:3000/account/storage/authorize?provider=dropbox',
    clientId: '0ljk1sqdvxnhd3i',
    authorizationUrl: `https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=0ljk1sqdvxnhd3i&redirect_uri=http://localhost:3000/account/storage/authorize?provider=dropbox`
  },
  // {
  //   id: 88181612,
  //   name: "Google Drive",
  //   redirectUri: 'http://localhost:3000/account/storage/authorize?provider=dropbox',
  //   clientId: '0ljk1sqdvxnhd3i',
  //   authorizationUrl: `https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=0ljk1sqdvxnhd3i&redirect_uri=http://localhost:3000/account/storage/authorize?provider=dropbox`
  // },
]