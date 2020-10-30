import React, { useContext, useEffect } from 'react'
import { AlertContext } from '../../context/alert/AlertContext'

function AlertComponent() {
  const { alertState, alertDispatch } = useContext(AlertContext);

  const clearAlert = (id) => {
    alertDispatch.clearAlert(id);
  }

  if (alertState.length === 0) {
    return null;
  }

  return (
    <>
      {alertState.map(alert => {
        return (
          <div className="flex flex-row justify-between items-center px-6 py-2 rounded-sm bg-red-600 text-white mx-2 mb-2 md:px-10" key={alert.id}>
            <h2 className="text-xl">{alert.msg}</h2>
            <h2 className="text-xl pl-2 cursor-pointer" onClick={() => clearAlert(alert.id)}>X</h2>
          </div>
        )
      })}
    </>
  )
}

export default AlertComponent
