import { SupportedELFChainId, TokenActionType } from 'types/index';
export interface ITokenData {
  Id: string;
  TokenName: string;
  TokenImage: string;
  TotalSupply: number;
  CurrentSupply: number;
  IssueChain: SupportedELFChainId;
  TokenAction: TokenActionType;
}
