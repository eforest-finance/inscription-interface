import { useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback } from 'react';
import { storages } from 'storages';
import { fetchToken } from 'api/request';
import { message } from 'antd';
import { getOriginalAddress } from 'utils/addressFormatting';
import { useRequest } from 'ahooks';
import deleteProvider from '@portkey/detect-provider';

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
    let sign = null;

    if (walletType === WalletType.discover) {
      const text = `Welcome! Click to sign in to aelf Inscriptions. This request will not trigger a blockchain transaction or cost any gas fees.`;
      const signStr = `signature: ${wallet?.address}-${timestamp}`;
      const hexDataStr = `${text}\n\n${signStr}`;
      const hexData = Buffer.from(hexDataStr).toString('hex');

      const provider: any = await deleteProvider({
        providerName: version === 'v1' ? 'portkey' : 'Portkey',
      });

      const signature = await provider.request({
        method: 'wallet_getManagerSignature',
        payload: { hexData },
      });

      if (!signature || signature.recoveryParam == null) return {};

      const signatureStr = [
        signature.r.toString(16, 64),
        signature.s.toString(16, 64),
        `0${signature.recoveryParam.toString()}`,
      ].join('');
      sign = { signature: signatureStr };
    } else {
      sign = await getSignature({
        appName: 'forest',
        address: wallet.address,
        signInfo: AElf.utils.sha256(`${wallet.address}-${timestamp}`),
      });
      if (sign?.errorMessage) {
        message.error(sign.errorMessage);
        return;
      }
    }
    // const sign = await getSignature({
    //   appName: 'forest',
    //   address: wallet.address,
    //   signInfo: AElf.utils.sha256(`${wallet.address}-${timestamp}`),
    // });
    // if (sign?.errorMessage) {
    //   message.error(sign.errorMessage);
    //   return;
    // }

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
  }, [
    loginState,
    wallet.address,
    wallet.publicKey,
    wallet?.portkeyInfo,
    wallet.discoverInfo,
    getSignature,
    walletType,
    runAsync,
    version,
  ]);

  return { getToken };
};
