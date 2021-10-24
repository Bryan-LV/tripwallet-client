import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'

import { FETCH_TRIP } from '../../queries/trips'
import TripData from '../presentational/TripData'
import Loader from '../presentational/Loader'

function Trip({ trip, setTripEdit, setExpenseData, setExpenseItem }) {
  // For case if user refreshes page
  let tripID = trip !== null ? trip._id : JSON.parse(localStorage.getItem('tripID'));
  const history = useHistory();
  
  const { error, data, loading } = useQuery(FETCH_TRIP, { variables: { id: tripID } });

  useEffect(() => {
    let tripID = localStorage.getItem('tripID');
    if (!tripID && trip === null) {
      history.push('/');
    }
  }, [])

  // TODO: handle error
  if (error) console.log(error);
  if (loading && !data) return <Loader />

  return (
    <div className="py-4" >
      <TripData data={data} setTripEdit={setTripEdit} setExpenseData={setExpenseData} setExpenseItem={setExpenseItem} />
    </div >
  )
}

export default Trip
