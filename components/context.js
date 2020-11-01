import React from 'react';

export const Context = React.createContext({
  logged: false,
  setLogged: () => { },
});
