import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const httpLink = new HttpLink({ uri: 'http://localhost:8080/graphql/' });
const cache = new InMemoryCache();

const authLink = new ApolloLink((operation, forward) => {
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);
  const auth = token.value ? `Bearer ${token.value}` : '';
  
  operation.setContext(({ headers = {} }) => ({ headers: { ...headers, authorization: auth }}));
  return forward(operation);
});

export const apolloClient = new ApolloClient({ 
  link: ApolloLink.from([authLink, httpLink]), 
  cache: cache 
});
