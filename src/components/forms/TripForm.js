import React, { useState, useContext } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import { AlertContext } from '../../context/alert/AlertContext'
import currencyCodes from '../../utils/currencyCodes'
import { CREATE_TRIP, UPDATE_TRIP, DELETE_TRIP, FETCH_TRIPS } from '../../queries/trips'
import PhotoSearchResults from '../presentational/PhotoSearchResults'
import DatePickerField from './DatePickerField';
import lockIcon from '../../assets/media/lock.svg'
import "react-datepicker/dist/react-datepicker.css";

const initVals = {
  tripName: '',
  foreignCurrency: 'EUR',
  baseCurrency: localStorage.getItem('baseCurrency'),
  budget: 0,
  startDate: new Date(),
  endDate: '',
  photo: ''
}

const editVals = (formDetails) => {
  return ({
    tripID: formDetails._id,
    tripName: formDetails.tripName,
    foreignCurrency: formDetails.foreignCurrency,
    budget: formDetails.budget ? formDetails.budget : 0,
    startDate: formDetails.startDate,
    endDate: formDetails.endDate ? formDetails.endDate : '',
    photo: formDetails.photo ? formDetails.photo : ''
  })
}

const validation = yup.object({
  tripName: yup.string().min(3).required('a trip name is required'),
  foreignCurrency: yup.string().min(3).max(3).required('a foreign currency is required'),
  baseCurrency: yup.string().min(3).max(3)
})

function TripForm({ isTripEdit }) {
  const history = useHistory();
  const { alertDispatch } = useContext(AlertContext);
  const [deleteSwitch, setDeleteSwitch] = useState(false);
  const [searchPhoto, setSearchPhoto] = useState('');
  const [searchProp, setSearchProp] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [openPhotoModal, setPhotoModal] = useState(false);

  // Apollo Queries
  const [createTrip] = useMutation(CREATE_TRIP, {
    onError: () => {
      alertDispatch.setAlert('Sorry, looks like your trip could not be created. Please try again.')
    },
    update: (cache, { data }) => {
      const cachedTrips = cache.readQuery({ query: FETCH_TRIPS });
      const newTrip = data.CreateTrip;
      cache.writeQuery({
        query: FETCH_TRIPS,
        data: { getTrips: [...cachedTrips.getTrips, newTrip] }
      })
    },
    onCompleted: () => history.push('/')
  });

  const [updateTrip] = useMutation(UPDATE_TRIP, {
    onError: (err) => {
      alertDispatch.setAlert('Sorry, looks like your trip could not be updated. Please try again.')
    },
    update: (cache, { data }) => {
      const cachedTrips = cache.readQuery({ query: FETCH_TRIPS });
      const newTrip = data.UpdateTrip;
      cache.writeQuery({
        query: FETCH_TRIPS,
        data: { getTrips: [...cachedTrips.getTrips, newTrip] }
      })
    },
    onCompleted: () => history.push('/trip')
  });

  const [deleteTrip] = useMutation(DELETE_TRIP, {
    onError: (err) => {
      alertDispatch.setAlert('Sorry, looks like your trip could not be deleted. Please try again.')
    },
    update: (cache, { data }) => {
      const cachedTrips = cache.readQuery({ query: FETCH_TRIPS });
      const filterTrips = cachedTrips.getTrips.filter(trip => trip._id !== isTripEdit.formDetails._id)
      cache.writeQuery({
        query: FETCH_TRIPS,
        data: { getTrips: filterTrips }
      })
    },
    onCompleted: () => history.push('/')
  });

  const handleSubmit = async (values) => {
    console.log('handle submit')
    try {
      if (selectedPhoto) {
        console.log('select photo clause')
        values.photo = selectedPhoto;
      }
      if (isTripEdit.isEdit) {
        console.log('edit trip clause')
        updateTrip({ variables: values })
      }
      else {
        console.log('create trip clause')
        createTrip({
          variables: values,
          update: (cache, { data }) => {
            const existingTrips = cache.readQuery({
              query: FETCH_TRIPS
            });
            // Add the new trip to the cache
            cache.writeQuery({
              query: FETCH_TRIPS,
              data: { getTrips: [data.createTrip, ...existingTrips.getTrips] }
            });
          }
        })
        // history.push('/');/
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closePhotoModal = () => setPhotoModal(false);

  const searchPexels = () => {
    if (searchPhoto === '') return null;
    setPhotoModal(true);
    setSearchProp(searchPhoto);
  }

  return (
    <div className="max-w-lg m-auto rounded-lg shadow-2xl py-8 relative">
      <div>
        {/* Title */}
        <h2 className="text-lg font-medium mx-10 mb-4">{isTripEdit.isEdit ? `Edit ${isTripEdit.formDetails.tripName} Trip` : 'Add Trip'}</h2>
      </div>

      <Formik
        initialValues={isTripEdit.isEdit ? editVals(isTripEdit.formDetails) : initVals}
        validationSchema={validation}
        onSubmit={handleSubmit}>
        <Form className="mt-2">

          {/* Trip name */}
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <Field type="text" name="tripName" placeholder="Trip name" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="tripName">{(errorMsg) => <p className="mx-10 text-red-700">{errorMsg}</p>}</ErrorMessage>

          {/* Trip Currency */}
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10 mb-8">
            <Field name="foreignCurrency" as="select" placeholder="Select Currency" placeholder="foreign currency" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none">
              {currencyCodes.map(currencyCode => <option key={currencyCode} value={currencyCode}>{currencyCode}</option>)}
            </Field>
          </div>
          <ErrorMessage name="foreignCurrency">{(errorMsg) => <p className="mx-10 text-red-700">{errorMsg}</p>}</ErrorMessage>

          {/* Budget */}
          <p className="mx-10  text-gray-400">(optional)</p>
          <div className="md:flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <p className="text-md pl-2">Budget</p>
            <Field type="number" name="budget" placeholder="Budget" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>

          {/* Start Date */}
          <div className="md:flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <label htmlFor="startDate" className="text-md px-2">Start Date</label>
            <DatePickerField name="startDate" className="bg-transparent pl-2 text-gray-800" />
          </div>

          {/* End Date */}
          <div className="md:flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <label htmlFor="startDate" className="text-md px-2">End Date</label>
            <DatePickerField name="endDate" className="bg-transparent pl-2" />
          </div>

          {/* Trip Photo */}
          <p className="mx-10 text-gray-400 pt-6 pb-2">(search for trip photo)</p>
          <div className="sm:flex items-center border-b border-b-2 border-gray-900 mx-10">
            <input type="text" name="photo" value={searchPhoto} onChange={(e) => setSearchPhoto(e.target.value)} placeholder="Photo" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />

          </div>

          <div className="text-right relative">
            <p className="py-3 my-1  text-sm text-center bg-gray-700 text-white rounded-lg cursor-pointer w-3/4 md:w-1/2" onClick={searchPexels}>Search Photos</p>
          </div>

          {openPhotoModal && <PhotoSearchResults searchProp={searchProp} closeModal={closePhotoModal} setSelectedPhoto={setSelectedPhoto} />}

          <div className="mx-10 my-4">
            {selectedPhoto && <img src={selectedPhoto} alt="" />}
          </div>


          <div className="text-center mt-4">
            <button type="submit" className="py-2 px-6 text-lg font-medium text-white rounded-lg bg-red-600 hover:bg-red-700 w-3/4 md:w-1/2">{isTripEdit.isEdit ? 'Update Trip' : 'Save Trip'}</button>
          </div>
        </Form>
      </Formik>
      {isTripEdit.isEdit && (
        <div className="w-8 cursor-pointer pt-2 m-auto" onClick={() => setDeleteSwitch(!deleteSwitch)}>
          <img src={lockIcon} alt="unlock delete button" />
        </div>
      )}
      {deleteSwitch && isTripEdit.isEdit && (
        <div className="mt-4">
          <button
            onClick={() => deleteTrip({ variables: { tripID: isTripEdit.formDetails._id } })}
            className="block m-auto py-3 px-6 text-lg font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 w-3/4 md:w-1/2">
            Delete Trip
          </button>
        </div>
      )}

    </div>
  )
}

export default TripForm
