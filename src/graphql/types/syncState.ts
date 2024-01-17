import { gql } from '@apollo/client';

export enum BlockFilterType {
  Block = 'BLOCK',
  LogEvent = 'LOG_EVENT',
  Transaction = 'TRANSACTION',
}

export type SyncStateQueryVariables = {
  dto: {
    chainId: string;
    filterType: BlockFilterType;
  };
};

export type SyncStateQuery = {
  confirmedBlockHeight: number;
};

export const SyncStateDocument = gql`
  query syncState($dto: GetSyncStateDto) {
    syncState(dto: $dto) {
      confirmedBlockHeight
    }
  }
`;
