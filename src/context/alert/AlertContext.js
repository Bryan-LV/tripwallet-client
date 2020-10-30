
import React, { createContext, useReducer } from 'react'
import alertReducer from './alertReducer';
import { CLEAR_ALERT, SET_ALERT } from './alertTypes';
import { v4 as uuid } from 'uuid';

export const AlertContext = createContext();

function AlertContextProvider(props) {
  const [alertState, dispatch] = useReducer(alertReducer, []);

  const alertOperations = {
    setAlert: (msg) => dispatch({ type: SET_ALERT, payload: { msg, id: uuid() } }),
    clearAlert: (id) => dispatch({ type: CLEAR_ALERT, payload: { id } })
  }

  return (
    <AlertContext.Provider value={{
      alertState: alertState,
      alertDispatch: alertOperations
    }}>
      {props.children}
    </AlertContext.Provider>
  )
}

export default AlertContextProvider
