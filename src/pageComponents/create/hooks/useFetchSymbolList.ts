import { fetchMySeedList } from 'api/request';
import { useCallback } from 'react';
import { useSelector } from 'redux/store';
import { addPrefixSuffix } from 'utils/addressFormatting';

export function useFetchSymbolList(chainID?: string) {
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const { walletInfo } = useSelector((store) => store.userInfo);
  const mainAddress = walletInfo?.aelfChainAddress;
  const AddressList =
    chainID && chainID === 'AELF' && mainAddress
      ? [addPrefixSuffix(mainAddress, 'AELF')]
      : mainAddress
      ? [addPrefixSuffix(mainAddress, 'AELF'), addPrefixSuffix(walletInfo.address, info.curChain)]
      : [addPrefixSuffix(walletInfo.address, info.curChain)];
  const handleFetchSeedList = useCallback(
    async (searchText: string, tokenType: number) => {
      if (!mainAddress) return [];
      const requestParams = Object.assign(
        {},
        {
          address: AddressList,
          status: 1,
          tokenType,
        },
        !searchText && {
          seedOwnedSymbol: searchText,
        },
      );

      try {
        const res = await fetchMySeedList(requestParams);
        const items = res.items.map((item) => {
          return {
            ...item,
            label: item.symbol,
            value: item.symbol,
          };
        });
        return items;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
    [mainAddress],
  );

  return { handleFetchSeedList };
}
