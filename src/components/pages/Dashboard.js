import React from 'react'
import { Link } from 'react-router-dom'
import Trips from '../containers/Trips';
import Button from '../UI/Button';

function Dashboard({ setTrip, auth, setTripEdit }) {

  return (
    <div className="bg-gray">

      <Trips setTrip={setTrip} />

      <div className="text-right">
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
