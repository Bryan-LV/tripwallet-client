import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'

import { AlertContext } from '../../context/alert/AlertContext';
import { loginSchemaValidation } from '../../utils/authFormValidation'
import { LOGIN_USER } from '../../queries/user'

function Login({ auth }) {
  const { alertDispatch } = useContext(AlertContext);
  const [passwordType, setPasswordType] = useState('password');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [queryLogin] = useMutation(LOGIN_USER, {
    onCompleted: async (data) => {
      auth.login(data.login);
    },
    onError: () => {
      alertDispatch.setAlert('Uh oh, looks like you entered in a wrong email or password');
    }
  })

  const handleLogin = async (valuesObj) => {
    setButtonDisabled(true);

    try {
      await queryLogin({ variables: valuesObj });
      setButtonDisabled(false);
    } catch (error) {
      // FIXME: Handle Error ( alert context maybe?)
      if (error.name === 'ValidationError') {
        console.log('validation error');
        error.errors.map(err => console.log(err));
      } else {
        console.log(error.message);
      }
      setButtonDisabled(false);
    }
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchemaValidation}
      onSubmit={handleLogin}
    >
      <Form>
        <h3 className="mx-10 text-2xl mb-2 text-gray-900">Welcome Back</h3>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" placeholder="Email" name="email" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="email">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type={passwordType} placeholder="Password" name="password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          {passwordType === 'password' ?
            (
              <svg onClick={() => setPasswordType('text')} className="w-6 h-6 cursor-pointer" data-darkreader-inline-fill="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            )
            :
            (
              <svg onClick={() => setPasswordType('password')} className="w-6 h-6 cursor-pointer" data-darkreader-inline-fill="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
            )
          }
        </div>
        <ErrorMessage name="password">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="text-right">
          <Link to="/register" className="inline-block mx-10 my-2 py-2 underline">Create an account</Link>
        </div>
        <div className="text-center mt-2">
          <button type="submit" disabled={buttonDisabled} className={`py-3 px-6 text-lg text-white rounded-lg font-medium bg-gray-800 hover:bg-gray-700 w-3/4 md:w-1/2 ${buttonDisabled && 'opacity-50 cursor-wait'}`}>Login</button>
        </div>
      </Form>
    </Formik >
  )
}

export default Login