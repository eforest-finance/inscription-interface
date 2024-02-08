import { useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback } from 'react';
import { storages } from 'storages';
import { fetchToken } from 'api/request';
import { message } from 'antd';
import { getOriginalAddress } from 'utils/addressFormatting';
import { useRequest } from 'ahooks';

const AElf = require('aelf-sdk');

export const useGetToken = () => {
  const { loginState, wallet, getSignature, walletType, version } = useWebLogin();

  const { runAsync } = useRequest(fetchToken, {
    retryCount: 3,
    manual: true,
    onSuccess(res) {
      localStorage.setItem(
        storages.accountInfo,
        JSON.stringify({
          account: wallet.address,
          token: res.access_token,
          expirationTime: Date.now() + res.expires_in * 1000,
        }),
      );
    },
  });

  const getToken = useCallback(async () => {
    if (loginState !== WebLoginState.logined) return;
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (accountInfo?.token && Date.now() < accountInfo?.expirationTime && accountInfo.account === wallet.address) {
      return;
    } else {
      localStorage.removeItem(storages.accountInfo);
    }
    const timestamp = Date.now();
    const sign = await getSignature({
      appName: 'forest',
      address: wallet.address,
      signInfo: AElf.utils.sha256(`${wallet.address}-${timestamp}`),
    });
    if (sign?.errorMessage) {
      message.error(sign.errorMessage);
      return;
    }
    let extraParam = {};
    if (walletType === WalletType.elf) {
      extraParam = {
        pubkey: wallet.publicKey,
        source: 'nightElf',
      };
    }
    if (walletType === WalletType.portkey || walletType === WalletType.discover) {
      const accounts = Object.entries((wallet?.portkeyInfo || wallet.discoverInfo || { accounts: {} })?.accounts);
      const accountInfo = accounts.map(([chainId, address]) => ({
        chainId,
        address: getOriginalAddress(walletType === WalletType.portkey ? address : address[0]),
      }));
      console.log('accountInfo', accountInfo);

      extraParam = {
        source: 'portkey',
        accountInfo: JSON.stringify(accountInfo),
      };
    }

    runAsync({
      grant_type: 'signature',
      scope: 'NFTMarketServer',
      client_id: 'NFTMarketServer_App',
      timestamp,
      signature: sign.signature,
      version: version === 'v1' ? 'v1' : 'v2',
      ...extraParam,
    } as ITokenParams);
  }, [loginState, getSignature, wallet]);

  return { getToken };
};
