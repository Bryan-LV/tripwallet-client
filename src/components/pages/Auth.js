import React from 'react'
import { useHistory, Route } from 'react-router-dom'
import Login from '../containers/Login'
import Register from '../containers/Register'

function Auth({ auth, user }) {

  if (user !== null) {
    useHistory.push('/');
  }

  return (
    <div className="max-w-md m-auto rounded-lg shadow-2xl py-6">
      <Route exact path="/login">
        <Login auth={auth} />
      </Route>
      <Route path="/register">
        <Register auth={auth} />
      </Route>
    </div>
  )
}

export default Auth