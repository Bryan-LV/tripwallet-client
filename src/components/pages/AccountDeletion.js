import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';

import { DELETE_USER } from '../../queries/user'

function AccountDeletion({ user, auth }) {
  const history = useHistory();
  const [promptAnswer, setPromptAnswer] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: _ => history.push('/login'),
    onError: err => console.log(err)
  });

  const handleDelete = async () => {
    if (promptAnswer) {
      await deleteUser({ variables: { id: user._id } })
      auth.logout()
    }
  }

  return (
    <div className="max-w-md m-auto rounded-lg shadow-2xl px-6 pb-4">
      <h3 className="text-2xl font-semibold pt-4">Account Deletion</h3>
      <p className="text-base py-4">You are about to delete your account. There is no undo button once your account has been deleted. All your data will be erased forever.</p>
      <div className="">
        <p className="text-xl ">Do you wish to proceed?</p>
        <div className="">
          <Link to="/"><button className="py-2 px-4 bg-gray-600 text-white font-semibold">No</button></Link>
          <button onClick={() => setPromptAnswer(true)} className="py-2 px-4 bg-red-600 text-white font-semibold">Yes</button>
        </div>
        {promptAnswer && <button onClick={handleDelete} className="w-full py-2 px-4 bg-red-600 text-white font-semibold">Delete My Account</button>}
      </div>

    </div>
  )
}

export default AccountDeletion
