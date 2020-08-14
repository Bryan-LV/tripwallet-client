import React, { useEffect, useState, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import lock from '../../assets/media/lock.svg'
import { FETCH_USER } from '../../queries/user'

function UserSettings({ user }) {
  const [fetchUser, { loading, data }] = useLazyQuery(FETCH_USER);
  const [DeleteBtnEnabled, setDeleteBtn] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUser({ variables: { id: user._id } })
    }
  }, [user])

  const handleEnableDeleteBtn = useCallback(
    () => {
      setDeleteBtn(true)
    },
    [DeleteBtnEnabled],
  )

  if (!user) return null

  return (
    <div className="max-w-md m-auto rounded-lg shadow-2xl px-6 pb-4">
      <div className="flex flex-row justify-between items-baseline">
        <h2 className="text-xl font-bold py-4">User Settings</h2>
        <Link to="/user/edit"><h4 className="underline">Edit Info</h4></Link>
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between hover:bg-gray-300">
          <p className="text-xl">Username</p>
          <p className="text-xl py-1 px-4 bg-gray-200 rounded-md mr-2">{data && data.user.username}</p>
        </div>
        <div className="flex flex-row justify-between py-4">
          <p className="text-xl">Email</p>
          <p className="text-xl py-1 px-4 bg-gray-200 rounded-md">{data && data.user.email}</p>
        </div>
        <div className="flex flex-row justify-between pb-4">
          <p className="text-xl">Base Currency</p>
          <p className="text-xl py-1 px-4 bg-gray-200 rounded-md">{data && data.user.baseCurrency}</p>
        </div>
      </div>
      <div className="">
        <h2 className="text-2xl text-red-600">Danger Zone</h2>
        <div className="flex flex-row justify-between">
          <p className="text-xl py-4">Delete Account</p>
          <div className="" onClick={handleEnableDeleteBtn}>
            <img src={lock} alt="unlock delete button" className="w-10" />
          </div>
        </div>
        {DeleteBtnEnabled && <Link to="/user/accountdeletion"><button className="py-3 px-6 w-full bg-red-600 text-white text-xl font-semibold rounded-lg">Delete My Account</button></Link>}
      </div>
    </div>
  )
}

export default UserSettings
