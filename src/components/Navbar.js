import React from 'react'
import { Link } from 'react-router-dom'
import hamIcon from '../assets/media/open-menu.png'
import plane from '../assets/media/mail.svg'

function Navbar({ setSidebar, showMenu }) {
  return (
    <div className="flex flex-row justify-between items-center px-8 py-4">
      <h1 className="text-2xl font-light flex flex-row items-center">
        <div className="w-8 pr-1 relative">
          <img src={plane} alt="logo" />
        </div>
        <Link to="/">tripwallet</Link>
      </h1>
      {showMenu && <div className="ham-icon bg-gray-800 rounded-full p-2 cursor-pointer" onClick={setSidebar}>
        <img className="h-8 w-9" src={hamIcon} alt="toggle menu" />
      </div>}
    </div>
  )
}

export default Navbar
