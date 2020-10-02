import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import AuthContextProvider from './context/auth/AuthContext'
import client from './utils/apolloClient'
import './styles/tailwind-output.css'
import './styles/App.css'

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </AuthContextProvider>
  </ApolloProvider>
  ,
  document.getElementById('root')
);
