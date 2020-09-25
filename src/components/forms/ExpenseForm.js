import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import DatePickerField from './DatePickerField'
import { useMutation } from '@apollo/client';
import currencyjs from 'currency.js'
import * as yup from 'yup';
import Axios from 'axios'
import dayjs from 'dayjs'

import { createYMDDate } from '../../utils/Dates'
import { CREATE_EXPENSE, UPDATE_EXPENSE } from '../../queries/expenses'
import { FETCH_TRIP } from '../../queries/trips'

const initFormValues = (tripID, expenseEditData) => {
  let initialValues
  if (expenseEditData) {
    initialValues = {
      tripID: tripID, // should always have tripid
      category: expenseEditData.category,
      expenseName: expenseEditData.expenseName,
      foreignPrice: expenseEditData.foreignPrice,
      baseCurrencyPrice: expenseEditData.baseCurrencyPrice,
      startDate: expenseEditData.startDate,
      endDate: expenseEditData.endDate,
      spread: expenseEditData.spread,
      notes: expenseEditData.notes
    }
  }
  else {
    initialValues = {
      tripID: tripID, // should always have tripid
      category: '',
      expenseName: '',
      foreignPrice: 0,
      baseCurrencyPrice: 0,
      startDate: dayjs(),
      endDate: '',
      spread: 0,
      notes: ''
    }

  }
  return initialValues;
}

const validation = yup.object({
  tripID: yup.string(),
  category: yup.string().trim().required('category is required'),
  expenseName: yup.string().trim().required('expense name is required'),
  foreignPrice: yup.number().required('price is required'),
  baseCurrencyPrice: yup.number(),
  spread: yup.number(),
  startDate: yup.string().required('a date is required'),
  endDate: yup.string(),
  notes: yup.string()
})

const getCurrenciesFromLS = () => {
  const tripCurrencies = localStorage.getItem('tripCurrencies') ? JSON.parse(localStorage.getItem('tripCurrencies')) : null;
  return tripCurrencies
}


function ExpenseForm({ expenseData }) {
  const tripID = expenseData ? expenseData.tripID : JSON.parse(localStorage.getItem('tripID'));
  const currencies = expenseData ? expenseData.currencies : getCurrenciesFromLS();
  const categories = expenseData ? expenseData.categories : ['Food', 'Accommodation'];
  const isExpenseEdit = expenseData ? expenseData.isExpenseEdit : false;
  const expenseEditData = expenseData ? expenseData.expenseEditData : null;
  const [conversionPrice, setConversionPrice] = useState(isExpenseEdit ? expenseEditData.baseCurrencyPrice : 0);
  const [isSpread, setSpread] = useState(false); // expense spread over mult. days
  const [exchangeRate, setExchangeRate] = useState(null);
  const history = useHistory();
  // Mutations
  const [addExpense] = useMutation(CREATE_EXPENSE, {
    onError: err => console.log(err),
    update: (cache, { data }) => {
      const cachedTrip = cache.readQuery({ query: FETCH_TRIP, variables: { id: tripID } });
      cache.writeQuery({
        query: FETCH_TRIP,
        variables: { id: tripID },
        data: { getTrip: { ...cachedTrip.getTrip, expenses: [...cachedTrip.getTrip.expenses, data.createExpense] } }
      })
    }
  })

  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
    onError: (err) => console.log(err),
  })

  const fetchExchangeRate = async () => {
    const req = await Axios.get(`https://api.exchangeratesapi.io/latest?base=${currencies.baseCurrency}&symbols=${currencies.baseCurrency},${currencies.foreignCurrency}`);
    setExchangeRate({ ...req.data, dateFetched: createYMDDate() });
    localStorage.setItem('rates', JSON.stringify({ ...req.data, dateFetched: createYMDDate() }));
  }

  useEffect(() => {
    function getCurrency() {
      let rates = localStorage.getItem('rates') ? JSON.parse(localStorage.getItem('rates')) : false;
      if (!rates) {
        // if no rates, hit the api & set to local storage
        fetchExchangeRate()
        return;
      }
      // if there are rates, then loop through rates in object, check if foreignCurrency in props matches FC in rates obj
      let currencyIsCorrect;
      for (const currency in rates.rates) {
        if (currency == currencies.foreignCurrency) {
          currencyIsCorrect = true;
        }
      }
      if (!currencyIsCorrect) {
        // if it does not match hit api
        fetchExchangeRate()
        return;
      }

      // if it matches, then check the date, if passed one day, hit api again
      const today = createYMDDate();
      if (today !== rates.dateFetched) {
        fetchExchangeRate();
        return;
      }
      // if it passes both match and day expiration then use those rates
      setExchangeRate(rates);
    }

    getCurrency()

  }, [])


  const handleSubmit = (formData) => {
    // convert baseCurrencyPrice to number
    formData.baseCurrencyPrice = +conversionPrice;
    const formatForeignCurrency = currencyjs(formData.foreignPrice, { precision: 2 }).format();
    formData.foreignPrice = +formatForeignCurrency;
    // check end date is earlier before start date
    if (formData.endDate) {
      const checkDates = dayjs(formData.endDate).isAfter(formData.startDate);
      if (!checkDates) {
        // TODO: Throw error
        console.error('end date is before start date');
        return;
      }
      // calculate spread by difference in start and end date
      const diffInDays = dayjs(formData.endDate).diff(formData.startDate, 'day');
      formData.spread = diffInDays;
    }

    if (isExpenseEdit) {
      // build expense edit object
      // expenseID, tripID, category, expenseName, foreignPrice, baseCurrencyPrice, spread, endDate, notes
      const expenseEdit = {
        tripID: tripID,
        expenseID: expenseEditData._id,
      }
      if (formData.expenseName !== expenseEditData.expenseName) expenseEdit.expenseName = formData.expenseName
      if (formData.category !== expenseEditData.category) expenseEdit.category = formData.category
      if (formData.foreignPrice !== expenseEditData.foreignPrice) expenseEdit.foreignPrice = formData.foreignPrice
      if (formData.baseCurrencyPrice !== expenseEditData.baseCurrencyPrice) expenseEdit.baseCurrencyPrice = formData.baseCurrencyPrice
      if (formData.startDate !== expenseEditData.startDate) expenseEdit.startDate = JSON.stringify(formData.startDate);
      if (formData.endDate !== expenseEditData.endDate) expenseEdit.endDate = JSON.stringify(formData.endDate);
      if (formData.spread !== expenseEditData.spread) expenseEdit.spread = formData.spread
      if (formData.notes !== expenseEditData.notes) expenseEdit.notes = formData.notes
      updateExpense({ variables: expenseEdit });

    } else {
      addExpense({ variables: formData })
    }
    history.push('/trip');
  }

  const handleCurrencyConversion = (value) => {
    let foreignCur;
    for (const cur in exchangeRate.rates) {
      if (cur == currencies.foreignCurrency) {
        foreignCur = exchangeRate.rates[cur];
      }
    }
    const price = value / foreignCur;
    const formatPrice = currencyjs(price).format();
    setConversionPrice(formatPrice)
  }

  return (
    <div className="rounded-lg shadow-2xl m-auto p-8 max-w-lg">
      <h2 className="text-lg font-medium">{isExpenseEdit ? 'Edit Expense' : 'Add Expense'}</h2>
      <Formik
        initialValues={initFormValues(tripID, expenseEditData)}
        validationSchema={validation}
        onSubmit={handleSubmit}>
        <Form className="w-full">

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2">
            <label htmlFor="foreignPrice" className="pl-2">{currencies.foreignCurrency}</label>
            <Field type="number" name="foreignPrice" placeholder="Price" validate={handleCurrencyConversion} className="appearance-none bg-transparent border-none w-1/3 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
            <p>{currencies.baseCurrency}</p>
            <p className="mx-10">{conversionPrice}</p>
          </div>
          <ErrorMessage name="foreignPrice" className="">{(errorMsg) => <p className="px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2">
            <Field type="text" name="expenseName" placeholder="Expense name" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="expenseName" className="">{(errorMsg) => <p className="px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2">
            <Field type="text" name="category" placeholder="Category" list="category" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
            <datalist id="category">
              {categories ? (categories.map(category => <option key={category} value={category}>{category}</option>)) : <> <option value="Food">Food</option> <option value="Accommodation">Accommodation</option> </>}
            </datalist>
          </div>
          <ErrorMessage name="category" className="">{(errorMsg) => <p className="px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2">
            <label htmlFor="startDate" className="text-md px-2 text-gray-500">Date</label>
            <DatePickerField name="startDate" className="bg-transparent" />
          </div>
          <ErrorMessage name="startDate" className="">{(errorMsg) => <p className="px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

          {isSpread ? (
            <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mt-4">
              <label htmlFor="endDate" className="text-md px-2 text-gray-700">End Date</label>
              <DatePickerField name="endDate" className="bg-transparent" />
            </div>) : null}
          <ErrorMessage name="endDate" className="">{(errorMsg) => <p className="px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="text-right">
            <p className="px-4 py-2 my-3 border-solid border border-gray-800 rounded-lg inline-block text-right cursor-pointer" onClick={() => setSpread(!isSpread)}>Spread</p>
          </div>

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2">
            <Field type="text" name="notes" placeholder="Notes" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="notes" className="">{(errorMsg) => <p className="px-2 text-red-700">{errorMsg}</p>}</ErrorMessage>

          <div className="text-center mt-4">
            <button className="py-3 px-6 text-lg font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 w-3/4 md:w-1/2" type="submit">{isExpenseEdit ? 'Save Edit' : 'Add Expense'}</button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

ExpenseForm.propTypes = {
  expenseData: PropTypes.object.isRequired
}

export default ExpenseForm
