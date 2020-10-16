
import React, { createContext, useReducer } from 'react'
import alertReducer from './AlertReducer';
import { SET_ALERT } from './alertTypes';

export const AlertContext = createContext();

function AlertContextProvider(props) {
  const [alertState, dispatch] = useReducer(alertReducer, { msg: null });

  const alertOperations = {
    setAlert: () => dispatch({ type: SET_ALERT, payload: { msg: 'set an alert' } })
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
