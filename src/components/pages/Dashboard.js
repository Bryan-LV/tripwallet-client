import React, { useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import Trips from '../containers/Trips';

function Dashboard({ user, setTrip, auth, setTripEdit }) {
  const history = useHistory();
  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
  }, [user, history])

  return (
    <div className="bg-gray">
      <Trips setTrip={setTrip} />
      <div className="text-right">
        <Link to="/tripform" onClick={() => setTripEdit({ isEdit: false, formDetails: null })} className="inline-block mx-10 my-5 p-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Add trip</Link>
        <button onClick={auth.logout} className="inline-block mx-10 my-5 p-4 bg-red-600 rounded-lg text-white font-semibold">Logout</button>
      </div>
    </div>
  )
}

export default Dashboard
