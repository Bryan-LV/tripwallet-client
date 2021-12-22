import React from 'react'
import { Link } from 'react-router-dom'
import Trips from '../containers/Trips';
import Button from '../UI-blocks/Button';

function Dashboard({ setTrip, auth, setTripEdit }) {

  return (
    <div className="pt-4 pb-24 md:py-4">

      <Trips setTrip={setTrip} />

      <div className="text-right fixed bottom-0 right-0 left-0 w-full bg-gray-100">
        <Link to="/tripform" onClick={() => setTripEdit({ isEdit: false, formDetails: null })} className="inline-block mx-10 my-5 p-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">
          Add trip
        </Link>

        <Button onClick={auth.logout} className="inline-block mx-10 my-5 p-4 bg-red-600 rounded-lg text-white font-semibold">
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Dashboard
