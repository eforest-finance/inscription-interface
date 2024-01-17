import { graphQLClientProvider } from './client';

import { InscriptionQueryVariables, InscriptionQuery, InscriptionDocument } from './types/inscription';
import {
  IssuedInscriptionVariables,
  IssuedInscriptionQuery,
  IssuedInscriptionDocument,
} from './types/issuedInscription';

import {
  InscriptionTransferQueryVariables,
  InscriptionTransferQuery,
  InscriptionTransferDocument,
} from './types/inscriptionTransfer';

import { SyncStateQueryVariables, SyncStateQuery, SyncStateDocument } from './types/syncState';

// Inscription detail
const getInscriptionDetailByAELF = async (params: InscriptionQueryVariables) => {
  const apolloClient = graphQLClientProvider();
  const result = await apolloClient.query<InscriptionQuery>({
    query: InscriptionDocument,
    variables: params,
  });
  return result;
};

// Inscription list
const getInscriptionList = async (params: IssuedInscriptionVariables) => {
  const apolloClient = graphQLClientProvider();
  const result = await apolloClient.query<IssuedInscriptionQuery>({
    query: IssuedInscriptionDocument,
    variables: params,
  });
  return result;
};

// Inscription latest
const getInscriptionLatest = async (params: InscriptionTransferQueryVariables) => {
  const apolloClient = graphQLClientProvider();
  const result = await apolloClient.query<InscriptionTransferQuery>({
    query: InscriptionTransferDocument,
    variables: params,
  });
  return result;
};

// get block height
const getBlockHeight = async (params: SyncStateQueryVariables) => {
  const apolloClient = graphQLClientProvider();
  const result = await apolloClient.query<SyncStateQuery>({
    query: SyncStateDocument,
    variables: params,
  });
  return result;
};

export { getInscriptionDetailByAELF, getInscriptionList, getInscriptionLatest, getBlockHeight };
