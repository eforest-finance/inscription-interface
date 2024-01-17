import { ApolloClient, NormalizedCacheObject, InMemoryCache, HttpLink, DefaultOptions } from '@apollo/client';
import { getBasePath } from 'utils/getBasePath';

let client: ApolloClient<NormalizedCacheObject> | null = null;

export const graphQLClientProvider = (
  graphqlUrl = `/AElfIndexer_Inscription/InscriptionIndexerSchema/graphql`,
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
