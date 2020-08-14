import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'

import getToken from './getToken'

// FIXME: if token is not valid, app breaks, handle error if token is not valid
const setAuthorizationLink = setContext(() => ({
  headers: { authorization: getToken() }
}));

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: setAuthorizationLink.concat(new HttpLink({
    uri: 'https://tripwalletserver.herokuapp.com/'
  }))
});

export default client