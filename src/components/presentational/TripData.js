import React from 'react'
import { Link } from 'react-router-dom'
import currency from 'currency.js'
import ExpenseList from './ExpenseList'
import ProgressBar from './ProgressBar';
import pen from '../../assets/media/pen.svg'

function TripData({ data, setTripEdit, setExpenseData, setExpenseItem }) {

  if (!data) return null;

  const formatMoney = (budget) => currency(budget, { precision: 0 }).format();

  const expenseFormRedirect = () => {
    setExpenseData({
      tripID: data.getTrip._id,
      categories: data.getTrip.categories,
      isExpenseEdit: false,
      expenseEditData: null,
      currencies: {
        baseCurrency: data.getTrip.baseCurrency,
        foreignCurrency: data.getTrip.foreignCurrency
      },
    })
  }

  const calcTotalSpent = () => {
    if (data.getTrip.expenses.length === 0) return 0
    const total = data.getTrip.expenses.reduce((acc, cur) => {
      let addExpenses = currency(acc).add(cur.baseCurrencyPrice);
      return addExpenses;
    }, 0);
    return total.value;
  }

  return (
    <div className="pb-24 md:pb-0">

      <div className="rounded-lg bg-white max-w-md m-auto mb-4 mt-3 shadow-lg">
        <h1 className="text-4xl text-center pt-5" >{data.getTrip.tripName}</h1>
        {data.getTrip.budget && <ProgressBar totalSpent={calcTotalSpent()} budget={data.getTrip.budget} />}
        <div className="flex flex-row justify-between mx-10 py-8">
          <h4><span className="font-medium">Spent </span> <span className="text-gray-800 font-thin text-2xl">{calcTotalSpent()}</span></h4>
          {data.getTrip.budget ? <h4> <span className="font-medium">Budget</span> <span className="text-gray-800 font-thin text-2xl">{formatMoney(data.getTrip.budget)}</span></h4> : <h4>No Budget</h4>}
        </div>
      </div>

      <div className="rounded-lg mb-2 py-4 max-w-md m-auto bg-gray-800 text-white flex flex-row justify-between">
        <div className="flex flex-row justify-start ml-10 font-semibold">
          <h4 className="pr-2 underline">Date</h4>
          <h4 className="hidden">Category</h4>
        </div>
        <div className="mr-10 font-light">
          <p><span className="text-sm">{data.getTrip.baseCurrency}</span> / <span className="text-sm">{data.getTrip.foreignCurrency}</span></p>
        </div>
      </div>

      <ExpenseList
        expenses={data.getTrip.expenses}
        setExpenseItem={setExpenseItem}
        expenseEditData={{
          tripID: data.getTrip._id,
          categories: data.getTrip.categories,
          isExpenseEdit: false,
          expenseEditData: null,
          currencies: {
            baseCurrency: data.getTrip.baseCurrency,
            foreignCurrency: data.getTrip.foreignCurrency
          }
        }} />


      <div className="flex flex-row justify-between items-end px-8 bg-white rounded-lg shadow-lg fixed bottom-0 left-0 right-0 w-full md:relative">
        <Link to="/tripform" onClick={() => setTripEdit({ isEdit: true, formDetails: data.getTrip })} className="inline-block my-5 rounded-full p-2 hover:bg-gray-200">
          <div className="w-10">
            <img className="relative trip-icons" src={pen} alt="edit trip" />
          </div>
        </Link>
        <Link to="/trip/expenseform" onClick={expenseFormRedirect} className="inline-block  my-5 rounded-full mr-1" >
          <div className="">
            <p className="py-3 px-5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">Add Expense</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default TripData
