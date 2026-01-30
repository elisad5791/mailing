import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default apolloClient;