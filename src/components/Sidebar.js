import React from 'react'
import { Link } from 'react-router-dom'
import { toTitleCase } from '../utils/StringHelpers'

function Sidebar({ user, auth, setSidebar }) {
  return (
    <div className="absolute top-0 right-0 h-full w-3/4 max-w-xs shadow-3xl bg-white z-50 px-6">
      <div className="flex flex-row justify-between items-center py-4">
        <h3 className="text-xl">{user.username ? `Hello, ${toTitleCase(user.username)}` : "Hello there"}</h3>
        <div className="" onClick={setSidebar}>
          <h4 className="font-bold text-2xl">X</h4>
        </div>
      </div>
      <div className="w-full m-auto bg-gray-900" style={{ height: '1px' }}></div>
      <div className="pt-4" onClick={setSidebar}>
        <Link to="/user">Account settings</Link>
      </div>
    </div>
  )
}

export default Sidebar
