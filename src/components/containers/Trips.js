import React from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'

import { FETCH_TRIPS } from '../../queries/trips'
import { setDates } from '../../utils/Dates'
import { toTitleCase } from '../../utils/StringHelpers'
import placeholderImg from '../../assets/media/placeholder-trip-image.jpg'
import pin from '../../assets/media/pin.svg'
import Loader from '../presentational/Loader'

function Trips({ setTrip }) {

    const { data, loading } = useQuery(FETCH_TRIPS, {
        onError: err => console.log(err)
    });
    const history = useHistory();

    const selectTrip = (trip) => {
        setTrip(trip);
        localStorage.setItem('tripID', JSON.stringify(trip._id));
        // FIXME: Maybe useful later on?
        localStorage.setItem('tripCurrencies', JSON.stringify({ baseCurrency: trip.baseCurrency, foreignCurrency: trip.foreignCurrency }));
        // Send user to trip page
        history.push('/trip');
    }

    if (loading && !data) return <Loader />

    return (
        <div className="mx-2 cursor-pointer md:grid md:grid-cols-2 lg:grid-cols-3">
            {!data?.getTrips.length && <h2 className="text-2xl text-center pt-5">Let's start adding trips!</h2>}
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
