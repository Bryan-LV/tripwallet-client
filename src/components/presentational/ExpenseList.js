import React from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { toTitleCase } from '../../utils/StringHelpers'
import { createDMYDate } from '../../utils/Dates'

function ExpenseList({ expenses, setExpenseItem, expenseEditData }) {

  // props receives expenses array, sort array by date
  const sortedExpenses = expenses.slice().sort((a, b) => {
    let aDate = new Date(a.startDate)
    let bDate = new Date(b.startDate);
    return dayjs(aDate).isAfter(dayjs(bDate)) ? 1 : -1
  })

  // create set of dates 
  const noRepeatingDates = Array.from(new Set(sortedExpenses.map(exp => createDMYDate(exp.startDate))));

  // create array of objects
  const transformDatesMap = noRepeatingDates.map(date => ({ date, expenses: [] }));

  // operation to apply
  const groupExpensesReducer = (datesArray, curItem) => {
    const copyDatesArray = datesArray.map(date => {
      if (date.date == createDMYDate(curItem.startDate)) {
        return { ...date, expenses: [...date.expenses, curItem] }
      }
      return date;
    })
    return copyDatesArray;
  }

  const groupExpenses = sortedExpenses.reduce(groupExpensesReducer, transformDatesMap);

  return (
    <div className="rounded-lg bg-white max-w-md m-auto mb-4 mt-3 shadow-lg">
      {groupExpenses.map(({ date, expenses }) => {
        return (<div key={date}>
          <h5 className="px-10 py-2">{date}</h5>
          {expenses.map(exp => {
            return (<Link to="/trip/expense" onClick={() => setExpenseItem({ exp, expenseEditData })} key={exp._id}  >
              <div className="flex justify-between px-10 py-3 font-light hover:bg-gray-200">
                <h4 className="text-gray-800">{toTitleCase(exp.expenseName)}</h4>
                <div className="flex justify-between text-gray-800">
                  <h4>{exp.baseCurrencyPrice}</h4> <span className="px-1">/</span>
                  <h4>{exp.foreignPrice}</h4>
                </div>
              </div>
            </Link>)
          })}
        </div>
        )
      })}
    </div>
  )
}

export default ExpenseList
