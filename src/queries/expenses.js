import { gql } from '@apollo/client'

const CREATE_EXPENSE = gql`
  mutation CreateExpense($tripID: ID! ,$category: String, $expenseName: String, $foreignPrice: Float ,$baseCurrencyPrice: Float ,$spread: Int ,$startDate: String ,$endDate: String ,$notes: String ){
    createExpense( newExpense: {tripID: $tripID ,category: $category, expenseName: $expenseName, foreignPrice: $foreignPrice ,baseCurrencyPrice: $baseCurrencyPrice ,spread: $spread ,startDate: $startDate ,endDate: $endDate ,notes: $notes}){
      _id
      tripID
  		category
      expenseName
      foreignPrice
      baseCurrencyPrice
      spread
      startDate
      endDate
      notes
  }
}
`

const UPDATE_EXPENSE = gql`
  mutation UpdateExpense ($expenseID: ID! $tripID: ID! $category: String $expenseName: String $foreignPrice: Float $baseCurrencyPrice: Float $spread: Int $startDate: String $endDate: String $notes: String){
      updateExpense(updateExpense: {expenseID: $expenseID tripID: $tripID category: $category expenseName: $expenseName foreignPrice: $foreignPrice baseCurrencyPrice: $baseCurrencyPrice spread: $spread startDate: $startDate endDate: $endDate notes: $notes}){
      _id
      tripID
      expenseName
      category
      foreignPrice
      baseCurrencyPrice
      spread
      startDate
      endDate
      notes
    }
  }
`

const DELETE_EXPENSE = gql`
  mutation DeleteExpense($expenseID: ID!){
    deleteExpense(expenseID: $expenseID){
      message
    }
  }
`

export { CREATE_EXPENSE, DELETE_EXPENSE, UPDATE_EXPENSE }