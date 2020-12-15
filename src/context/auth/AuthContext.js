import React, { createContext, useReducer } from 'react'

import authReducer from './authReducer'
import { LOGIN_USER, LOGOUT, PERSIST_USER } from './authTypes'
import setToken from '../../utils/setToken'
import { useEffect } from 'react';
import checkToken from '../../utils/checkToken';

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [authState, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    // Client token validation
    if (!authState.user) {
      const isValidToken = checkToken();
      if (isValidToken) authOperations.persistUser()
    }
  }, [])

  const authOperations = {
    login: (userData) => {
      // set token
      setToken(userData);
      localStorage.setItem('baseCurrency', userData.baseCurrency);
      // set user to context
      dispatch({ type: LOGIN_USER, payload: { _id: userData._id, username: userData.username, baseCurrency: userData.baseCurrency } })
    },
    logout: () => {
      dispatch({ type: LOGOUT });
    },
    persistUser: async () => {
      dispatch({ type: PERSIST_USER });
    }
  }

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      auth: authOperations
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
