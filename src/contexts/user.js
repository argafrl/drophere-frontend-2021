import React from 'react';

export const user = null;
export const UserContext = React.createContext({
  user,
  setUser: newUser => {},
});