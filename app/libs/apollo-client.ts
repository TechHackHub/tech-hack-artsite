import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    uri: '/api/graphql', // Your GraphQL API endpoint
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
