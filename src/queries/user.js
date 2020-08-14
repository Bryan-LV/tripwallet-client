import { gql } from '@apollo/client'

const LOGIN_USER = gql`
  mutation LoginUser($email:String!, $password:String!) {
    login(loginUser: {email:$email, password:$password}){
      _id
      username
      token
      baseCurrency
    }
  }
`

const REGISTER_USER = gql`
  mutation RegisterUser($name:String!, $username:String!, $email: String!, $baseCurrency: String!, $password: String!, $confirmPassword: String!){
    register(registerUser: {name: $name, username: $username, email:$email, baseCurrency:$baseCurrency, password:$password , confirmPassword:$confirmPassword}){
      _id
      username
      token
      baseCurrency
    }
  }
`

const CHECK_AUTH_TOKEN = gql`
  {
    checkAuth{
      isValid
    }
  }
`

const FETCH_USER = gql`
  query FetchUser ($id: ID!){
   user(id: $id) { 
		_id
    username
    name
    email
    baseCurrency
    createdAt
  }
}
`

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!){
    deleteUser(id:$id){
      message
      isValid
    }
  }
`

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $username: String, $email: String, $baseCurrency: String, $currentPassword: String, $newPassword: String, $confirmNewPassword: String){
    updateUser( updateUser: {id: $id, name: $name, username: $username, email: $email, baseCurrency: $baseCurrency, currentPassword: $currentPassword, newPassword: $newPassword, confirmNewPassword: $confirmNewPassword}){
      _id
      username
      name
      email
      baseCurrency
      createdAt
    }
  }
`

export { LOGIN_USER, CHECK_AUTH_TOKEN, REGISTER_USER, FETCH_USER, DELETE_USER, UPDATE_USER }