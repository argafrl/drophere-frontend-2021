import React from 'react';

export const token = '';
export const TokenContext = React.createContext({
  token,
  setToken: newToken => {},
});