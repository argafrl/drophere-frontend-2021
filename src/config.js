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