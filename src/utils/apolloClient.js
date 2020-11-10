import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'

import getToken from './getToken'

const URI = process.env.NODE_ENV === 'production' ? 'https://tripwalletserver.herokuapp.com/' : 'http://localhost:4000/'

const setAuthorizationLink = setContext(() => ({
  headers: { authorization: getToken() }
}));

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: setAuthorizationLink.concat(new HttpLink({
    uri: URI
  }))
});

export default client