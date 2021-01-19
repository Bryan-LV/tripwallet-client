import React, { useEffect } from 'react'
import { useHistory, Route } from 'react-router-dom'
import Login from '../containers/Login'
import Register from '../containers/Register'
import mail from '../../assets/media/mail.svg'

function Auth({ auth, user }) {

  useEffect(() => {
    if (user !== null) {
      useHistory.push('/');
    }
  }, [])

  return (
    <div className="min-h-screen py-10 " >
      <div className="text-center max-w-screen-lg mx-2 md:mx-auto pb-6">

        <div className="">
          <img src={mail} alt="logo" className=" h-24 md:h-32 lg:h-40 mx-auto" />
        </div>
        <h1 className="font-bold text-gray-900 text-5xl md:text-6xl lg:text-8xl">TripWallet</h1>
        <p className="text-1xl md:text-3xl lg:text-4xl text-gray-800 max-w-screen-md mx-auto">A travel expense tracker that does currency conversions for you on the fly with real time currency exchange rates.</p>
      </div>
      <div className="max-w-md m-auto rounded-lg shadow-2xl py-6 bg-white">
        <Route exact path="/login">
          <Login auth={auth} />
        </Route>
        <Route path="/register">
          <Register auth={auth} />
        </Route>
      </div>
    </div>
  )
}

export default Auth