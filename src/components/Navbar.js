import React from 'react'
import { Link } from 'react-router-dom'
import plane from '../assets/media/mail.svg'

function Navbar({ setSidebar, showMenu }) {
  return (
    <div className="flex flex-row justify-between items-center px-8 py-6">
      <h1 className="font-light flex flex-row items-center">
        <div className="w-8 pr-1 relative">
          <img src={plane} alt="logo" />
        </div>
        <Link to="/" className="text-3xl">tripwallet</Link>
      </h1>
      {showMenu && (
        <div className=" p-2 cursor-pointer" onClick={setSidebar}>
          <svg className="w-10 h-10" fill="#1a202c" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        </div>)}
    </div>
  )
}

export default Navbar
