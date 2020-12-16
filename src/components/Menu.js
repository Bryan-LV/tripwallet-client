import React from 'react'
import { Link } from 'react-router-dom'


function Menu({ user, closeMenu }) {
  return (
    <div className="fixed min-h-screen bg-gray-900 z-50 top-0 left-0 right-0 bottom-0">

      {user &&
        (
          <div className="mx-10">
            <div className="flex flex-row justify-between items-center py-10 text-white">
              <h3 className="text-xl">{user.username ? `Hello, ${user.username}` : "Hello there"}</h3>
              <div className="" onClick={_ => closeMenu(false)}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </div>
            </div>
            <div className="pt-4 text-center" >
              <Link to="/" onClick={_ => closeMenu(false)} className="text-white text-2xl block py-2 md:text-3xl">Dashboard</Link>
              <Link to="/user" onClick={_ => closeMenu(false)} className="text-white text-2xl block py-2 md:text-3xl">User settings</Link>
            </div>
          </div>
        )}

    </div>
  )
}

export default Menu
