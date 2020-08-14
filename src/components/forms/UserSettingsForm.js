import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { updateSchemaValidation } from '../../utils/authFormValidation'
import { FETCH_USER, UPDATE_USER } from '../../queries/user'
import currencyCodes from '../../utils/currencyCodes'

function UserSettingsForm({ user }) {
  const [initVals, setInitVals] = useState({
    _id: '',
    name: '',
    username: '',
    email: '',
    baseCurrency: '',
    password: '',
    confirmPassword: ''
  })
  const [fetchUser, { data }] = useLazyQuery(FETCH_USER, {
    onCompleted: data => setInitVals(data.user)
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onError: err => console.error(err)
  });

  useEffect(() => {
    if (user) {
      fetchUser({ variables: { id: user._id } })
    }
    if (data) {
      setInitVals(data.user);
    }
  }, [user, data])

  if (!user) return null;

  const handleSubmit = async (values) => {
    const accountUpdateObj = { id: user._id };

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        const element = values[key];
        if (element) {
          accountUpdateObj[key] = element;
        }
      }
    }
    await updateUser({ variables: accountUpdateObj });
  }


  return (
    <div className="max-w-lg m-auto rounded-lg shadow-2xl py-8">
      <Formik
        initialValues={initVals}
        validationSchema={updateSchemaValidation}
        onSubmit={handleSubmit}
      >
        <Form>
          <h4 className="text-lg font-medium mx-10 mb-4">Edit Account Info</h4>
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <h4 className="">Name</h4>
            <Field type="text" name="name" placeholder={data ? data.user.name : 'name'} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="name">{(errorMsg) => <p className="mx-10 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <h4 className="">Username</h4>
            <Field type="text" name="username" placeholder={data ? data.user.username : 'username'} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="username">{(errorMsg) => <p className="mx-10 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <h4 className="">Email</h4>
            <Field type="text" name="email" placeholder={data ? data.user.email : 'email'} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="email">{(errorMsg) => <p className="mx-10 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10 mb-8">
            <h4 className="">Base Currency</h4>
            <Field name="baseCurrency" as="select" placeholder="Select Currency" placeholder="Base Currency" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none">
              {currencyCodes.map(currencyCode => <option key={currencyCode} value={currencyCode}>{currencyCode}</option>)}
            </Field>
          </div>
          <ErrorMessage name="baseCurrency">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="text-center mt-4">
            <button type="submit" className="py-3 px-6 text-lg font-medium text-white rounded-lg bg-red-600 hover:bg-red-700 w-3/4 md:w-1/2">Save Trip</button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default UserSettingsForm
