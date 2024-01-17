import { gql } from '@apollo/client';

export type IssuedInscriptionVariablesInput = {
  chainId: string;
  tick: string | null;
  isCompleted?: boolean;
  sorting?: string;
  skipCount: number;
  maxResultCount: number;
};

export type IssuedInscriptionVariables = {
  input: IssuedInscriptionVariablesInput;
};

export type IssuedInscriptionQueryItems = {
  amt: number;
  tick: string;
  issuedToAddress: string;
  issuedTime: string;
  mintedAmt: number;
  progress: number;
  holderCount: number;
  transactionCount: number;
  isCompleted: boolean;
  image: string;
  issuedTransactionId: string;
  id: string;
  chainId: string;
  blockHash: string;
  blockHeight: number;
  blockTime: string;
};

export type IssuedInscriptionQuery = {
  totalCount: number;
  items: IssuedInscriptionQueryItems[];
};

export type IssuedInscriptionQueryRes = {
  data: {
    issuedInscription: {
      totalCount: number;
      items: IssuedInscriptionQueryItems[];
    };
  };
};

export const IssuedInscriptionDocument = gql`
  query issuedInscription($input: GetIssuedInscriptionInput) {
    issuedInscription(input: $input) {
      totalCount
      items {
        amt
        tick
        issuedToAddress
        issuedTime
        mintedAmt
        progress
        image
        holderCount
        transactionCount
        isCompleted
        issuedTransactionId
        id
        chainId
        blockHash
        blockHeight
        blockTime
      }
    }
  }
`;
