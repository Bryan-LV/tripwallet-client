import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import useToggle from '../../hooks/useToggle'
import { registerSchemaValidation } from '../../utils/authFormValidation'
import { REGISTER_USER } from '../../queries/user'
import currencyCodes from '../../utils/currencyCodes'
import { AlertContext } from '../../context/alert/AlertContext'

function Register({ auth }) {
  const [showPasswordTip, togglePasswordTip] = useToggle(false);
  const [passwordType, setPasswordType] = useState('password');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { alertDispatch } = useContext(AlertContext);

  const [queryRegister] = useMutation(REGISTER_USER, {
    onCompleted: async (data) => {
      auth.login(data.register);
    },
    onError: () => {
      alertDispatch.setAlert('Uh oh, looks like we could not create your account. Please try again.');
    }
  })

  const handleRegister = async (valuesObj) => {
    setButtonDisabled(true);
    try {
      await queryRegister({ variables: valuesObj });
    }
    catch (err) {
      setButtonDisabled(false)
    }
  }

  const handleTogglePasswordType = (e) => {
    e.preventDefault();
    setPasswordType('password')
  }


  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        baseCurrency: 'EUR',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={registerSchemaValidation}
      onSubmit={handleRegister}>

      <Form>
        <h3 className="mx-10 text-2xl mb-2 text-gray-900">Create An Account</h3>

        {/* Username */}
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="username" placeholder="Username" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="username">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        {/* Email */}
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="email" placeholder="Email" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="email">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        {/* Base Currency */}
        <p className="text-xs text-gray-500 tracking-wide mx-10 pt-6">choose your base currency</p>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10 mb-8">
          <Field name="baseCurrency" as="select" placeholder="Select Currency" placeholder="Base Currency" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none">
            {currencyCodes.map(currencyCode => <option key={currencyCode} value={currencyCode}>{currencyCode}</option>)}
          </Field>
        </div>
        <ErrorMessage name="baseCurrency">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        {/* Toggle Password Tips */}
        <div className="flex flex-col items-end justify-end mx-10 cursor-pointer relative">
          <svg onMouseEnter={() => togglePasswordTip()} onClick={() => togglePasswordTip()} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>

        {/* Passwords */}
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type={passwordType} name="password" placeholder="Password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          {passwordType === 'password' ?
            (
              <svg onClick={() => setPasswordType('text')} className="w-6 h-6 cursor-pointer" data-darkreader-inline-fill="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            )
            :
            (
              <svg onClick={handleTogglePasswordType} className="w-6 h-6 cursor-pointer" data-darkreader-inline-fill="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
            )
          }
        </div>
        <ErrorMessage name="password">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type={passwordType} name="confirmPassword" placeholder="Confirm Password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="confirmPassword">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        {/* Password hint table  */}
        <div className={`text-sm text-gray-600 mx-10 ${showPasswordTip ? 'block' : 'hidden'}`}>
          <p className="">Min. of 8 characters</p>
          <p className="">Includes at least 1 lower & uppercase letter</p>
          <p className="">and at least 1 number, and 1 special character (!@#$...)</p>
        </div>

        {/* Already has account */}
        <div className="text-right">
          <Link to="/login" className="inline-block mx-10 my-2 p-2 underline"> Login to your account</Link>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button type="submit" className={`py-3 px-6 text-lg font-medium bg-gray-900 hover:bg-gray-800 rounded-lg text-white w-3/4 md:w-1/2 ${buttonDisabled && 'opacity-50 cursor-wait'}`}>Register</button>
        </div>
      </Form >
    </Formik>
  )
}

export default Register