import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import * as dayjs from 'dayjs'

import { FETCH_TRIPS } from '../../queries/trips'
import { createDMYDate } from '../../utils/Dates'
import { toTitleCase } from '../../utils/StringHelpers'
import placeholderImg from '../../assets/media/placeholder-trip-image.jpg'
import pin from '../../assets/media/pin.svg'

function Trips({ setTrip }) {
  // query user trip
  const [fetchTrips, { data }] = useLazyQuery(FETCH_TRIPS, {
    onError: err => console.log(err)
  });

  const history = useHistory();

  useEffect(() => {
    fetchTrips();
  }, [])

  const selectTrip = (trip) => {
    // set Trip
    setTrip(trip);
    // set trip id to local storage
    localStorage.setItem('tripID', JSON.stringify(trip._id));
    // FIXME: Maybe useful later on?
    localStorage.setItem('tripCurrencies', JSON.stringify({ baseCurrency: trip.baseCurrency, foreignCurrency: trip.foreignCurrency }));
    // send user to trip page
    history.push('/trip');
  }

  const setDates = (startDate, endDate) => {
    const formatStartDate = createDMYDate(startDate);
    if (!endDate) {
      return formatStartDate;
    } else {
      const formatEndDate = createDMYDate(endDate);
      return `${formatStartDate} - ${formatEndDate} `
    }
  }

  return (
    <div className="mx-2 cursor-pointer md:grid md:grid-cols-2 lg:grid-cols-3">
      {data && data.getTrips.map(trip => {
        return (
          <div className="rounded-lg bg-white max-w-sm m-auto mb-4 mt-3 shadow-lg lg:mx-4" key={trip._id} onClick={() => selectTrip(trip)}>
            <div>
              <img className="rounded-t-lg object-cover object-center w-full h-64" src={trip.photo ? trip.photo : placeholderImg} />
            </div>
            <div className="p-6 rounded-b-lg">
              <h4 className="text-3xl font-semibold">{toTitleCase(trip.tripName)}</h4>
              <p className="text-xl font-thin pb-1">{setDates(trip.startDate, trip.endDate)}</p>
              <div className="flex flex-row justify-between items-center">
                <p className="text-xl pb-2">
                  <span className="font-thin pr-1"> {trip.totalSpent}</span>
                  <span className="text-xs">{trip.baseCurrency}</span>
                </p>
                <div className="w-8 relative trip-pin">
                  <img src={pin} alt="" />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div >
  )
}

export default Trips
