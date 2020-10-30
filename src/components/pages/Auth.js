import React, { useEffect, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { useHistory, Link, Route } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { loginSchemaValidation, registerSchemaValidation } from '../../utils/authFormValidation'
import { LOGIN_USER, REGISTER_USER } from '../../queries/user'
import currencyCodes from '../../utils/currencyCodes'
import { AlertContext } from '../../context/alert/AlertContext'

const Login = ({ auth, url }) => {
  const { alertDispatch } = useContext(AlertContext);
  const [queryLogin] = useMutation(LOGIN_USER, {
    onCompleted: async (data) => {
      auth.login(data.login);
    },
    onError: () => {
      alertDispatch.setAlert('Uh oh, looks like you entered in a wrong email or password');
    }
  })

  const handleLogin = async (values) => {
    try {
      // query user ? set user context & set token : show error
      await queryLogin({ variables: values });
    } catch (error) {
      // FIXME: Handle Error ( alert context maybe?)
      if (error.name === 'ValidationError') {
        console.log('validation error');
        error.errors.map(err => console.log(err));
      } else {
        console.log(error.message);
      }
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
          <Field type="password" placeholder="Password" name="password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="password">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="text-right">
          <Link to="/register" className="inline-block mx-10 my-2 py-2 underline">Create an account</Link>
        </div>
        <div className="text-center mt-2">
          <button type="submit" className="py-3 px-6 text-lg text-white rounded-lg font-medium bg-gray-800 hover:bg-gray-700 w-3/4 md:w-1/2">Login</button>
        </div>
      </Form>
    </Formik>
  )
}

const Register = ({ auth }) => {
  const [queryRegister] = useMutation(REGISTER_USER, {
    onCompleted: async (data) => {
      auth.login(data.register);
    },
    onError: (error) => {
      // TODO: Handle Error ( alert context maybe?)
      console.log(error.message);
    }
  })

  const handleRegister = async (values) => {

    try {
      // query user ? set user context & set token : show error
      await queryRegister({ variables: values });
    } catch (error) {
      // FIXME: Handle Error ( alert context maybe?)
      if (error.name === 'ValidationError') {
        console.log('validation error');
        error.errors.map(err => console.log(err));
      } else {
        console.log(error);
      }
    }
  }

  return (
    <Formik
      initialValues={{
        name: '',
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
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="name" placeholder="Name" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="name">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="username" placeholder="Username" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="username">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="email" placeholder="Email" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="email">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10 mb-8">
          <Field name="baseCurrency" as="select" placeholder="Select Currency" placeholder="Base Currency" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none">
            {currencyCodes.map(currencyCode => <option key={currencyCode} value={currencyCode}>{currencyCode}</option>)}
          </Field>
        </div>
        <ErrorMessage name="baseCurrency">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="password" name="password" placeholder="Password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="password">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="confirmPassword">{(errorMsg) => <p className="mx-10 px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

        <div className="text-right">
          <Link to="/login" className="inline-block mx-10 my-2 p-2 underline"> Login to your account</Link>
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="py-3 px-6 text-lg font-medium bg-gray-800 hover:bg-gray-700 rounded-lg text-white w-3/4 md:w-1/2">Register</button>
        </div>
      </Form >
    </Formik>
  )
}

function Auth({ auth, user }) {
  const history = useHistory()
  useEffect(() => {
    if (user !== null) {
      history.push('/');
    }

  }, [user])

  return (
    <div className="max-w-md m-auto rounded-lg shadow-2xl py-6">
      <Route exact path="/login">
        <Login auth={auth} />
      </Route>
      <Route path="/register">
        <Register auth={auth} />
      </Route>
    </div>
  )
}

export default Auth