import { ApolloClient, NormalizedCacheObject, InMemoryCache, HttpLink, DefaultOptions } from '@apollo/client';

let client: ApolloClient<NormalizedCacheObject> | null = null;

const { NEXT_PUBLIC_APP_ENV } = process.env;
const graphqlUrlPrefix =
  NEXT_PUBLIC_APP_ENV === 'production' ? 'https://indexer-api.aefinder.io' : 'https://test-indexer-api.aefinder.io';
console.log(graphqlUrlPrefix, 'graphqlUrlPrefix');

export const graphQLClientProvider = (
  graphqlUrl = `${graphqlUrlPrefix}/api/app/graphql/inscription`,
  defaultOptions: DefaultOptions = {},
) => {
  if (!client) {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      queryDeduplication: false,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
        query: {
          fetchPolicy: 'network-only',
        },
        ...defaultOptions,
      },
      link: new HttpLink({ uri: graphqlUrl }),
    });
  }
  return client;
};
