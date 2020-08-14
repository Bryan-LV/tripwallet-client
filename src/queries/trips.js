import { gql } from '@apollo/client'

const FETCH_TRIPS = gql`
  query FetchTrips{
    getTrips{
      _id
      tripName
      startDate
      endDate
      foreignCurrency
      baseCurrency
      totalSpent
      photo
    }
  }
`

const FETCH_TRIP = gql`
  query FetchTrip($id: ID!){
    getTrip(id: $id){
      _id
      user
      tripName
      foreignCurrency
      baseCurrency
      budget
      startDate
      endDate
      categories
      photo
      
      expenses{
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
  }
`

const CREATE_TRIP = gql`
  mutation CreateTrip($tripName: String!,$foreignCurrency:String!, $baseCurrency:String!, $budget: Int, $startDate:String, $endDate:String, $photo:String ) {
    createTrip(createTrip: {tripName: $tripName, foreignCurrency: $foreignCurrency, baseCurrency: $baseCurrency, budget: $budget, startDate: $startDate, endDate: $endDate, photo: $photo }){
      _id
      user
      tripName
      foreignCurrency
      baseCurrency
      budget
      startDate
      endDate
      categories
      photo

      expenses{
        _id
      }
    }
  }
`


const UPDATE_TRIP = gql`
  mutation UpdateTrip($tripID: ID!, $tripName: String, $foreignCurrency: String, $budget: Int, $startDate: String, $endDate: String, $photo: String){
    updateTrip(updateTrip: {tripID: $tripID, tripName: $tripName, foreignCurrency: $foreignCurrency, budget: $budget, startDate: $startDate, endDate: $endDate, photo: $photo}){
      _id
      user
      tripName
      foreignCurrency
      baseCurrency
      budget
      startDate
      endDate
      categories
      photo

      expenses{
        _id
      }
    }
  }
`

const DELETE_TRIP = gql`
  mutation DeleteTrip($tripID: ID!){
    deleteTrip(tripID: $tripID){
      message
    }
  }
`

const SEARCH_PHOTOS = gql`
  query ($query: String!) {
    getPhotos(query: $query){
      url
      width
      id
      src {
        medium
      }
    }
  }
`

export { FETCH_TRIPS, FETCH_TRIP, CREATE_TRIP, UPDATE_TRIP, DELETE_TRIP, SEARCH_PHOTOS }