import { aelf, sigObjToStr } from '@portkey/utils';
import AElf from 'aelf-sdk';
import deleteProvider from '@portkey/detect-provider';
import { MethodsWallet } from '@portkey/provider-types';
import { createManagerForwardCall } from '@portkey/contracts';
import { getRawParams } from './decodeTx';

export type TGetRawTx = {
  blockHeightInput: string;
  blockHashInput: string;
  packedInput: string;
  address: string;
  contractAddress: string;
  functionName: string;
};

export function getAElf(rpcUrl: string) {
  return new AElf(new AElf.providers.HttpProvider(rpcUrl));
}

export const getRawTransactionDiscover = async ({
  caAddress,
  contractAddress,
  caContractAddress,
  rpcUrl,
  params,
  methodName,
}: any) => {
  try {
    const instance = aelf.getAelfInstance(rpcUrl);
    const provider = await deleteProvider({ providerName: 'Portkey' });
    console.log('=====provider', provider);

    if (!provider) return;
    const caHash = await provider.request({
      method: 'caHash',
    });
    const [managerForwardCall, managerAddress] = await Promise.all([
      createManagerForwardCall({
        instance,
        paramsOption: {
          contractAddress,
          methodName,
          args: params,
          caHash: caHash,
        },
        caContractAddress,
      }),
      provider.request({
        method: MethodsWallet.GET_WALLET_CURRENT_MANAGER_ADDRESS,
      }),
    ]);
    const { BestChainHeight, BestChainHash } = await instance.chain.getChainStatus();

    const transaction = await handleTransaction({
      blockHeightInput: BestChainHeight,
      blockHashInput: BestChainHash,
      packedInput: managerForwardCall,
      address: managerAddress,
      contractAddress: caContractAddress,
      functionName: 'ManagerForwardCall',
      provider,
      rpcUrl,
    });
    console.log('=====transaction', transaction);

    return transaction;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const handleTransaction = async ({
  blockHeightInput,
  blockHashInput,
  packedInput,
  address,
  contractAddress,
  functionName,
  provider,
  rpcUrl,
}: any) => {
  try {
    // Create transaction
    const rawTx = aelf.getRawTx({
      blockHeightInput,
      blockHashInput,
      packedInput,
      address,
      contractAddress,
      functionName,
    });
    rawTx.params = Buffer.from(rawTx.params, 'hex');

    const signData = aelf.encodeTransaction(rawTx);

    console.log(signData, 'signData===');

    const instance1 = getAElf(rpcUrl);

    const p = await getRawParams(instance1, signData);
    console.log(p, instance1, '===getRawParams');

    const sin = await provider.request({
      method: MethodsWallet.GET_WALLET_TRANSACTION_SIGNATURE,
      payload: { data: aelf.encodeTransaction(rawTx) },
    });

    const transaction = aelf.encodeTransaction({
      ...rawTx,
      signature: Buffer.from(sigObjToStr(sin as any), 'hex'),
    });

    return transaction;
  } catch (error) {
    return Promise.reject(error);
  }
};
