import AElf from 'aelf-sdk';
const { transform } = AElf.utils;
import { getContractBasic, handleManagerForwardCall, getContractMethods } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { IPortkeyProvider, MethodsWallet } from '@portkey/provider-types';
import { did } from '@portkey/did-ui-react';
import deleteProvider from '@portkey/detect-provider';
import { store, useSelector } from 'redux/store';
import { WalletInfoType } from 'types';
import { WalletType } from 'aelf-web-login';
import { getRawTransactionNight } from './getRawTransactionNight';
// did.setConfig({
//   graphQLUrl: 'http://192.168.66.203:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
// });

export const encodedParams = (inputType: any, params: any) => {
  let input = transform.transformMapToArray(inputType, params);
  input = transform.transform(inputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);
  const message = inputType.create(input);
  return inputType.encode(message).finish();
};

interface IRowTransactionPortkeyParams {
  caHash: string;
  privateKey: string;
  contractAddress: string;
  caContractAddress: string;
  rpcUrl: string;
  params: any;
  methodName: string;
}

export function getAElf(rpcUrl: string) {
  return new AElf(new AElf.providers.HttpProvider(rpcUrl));
}

export type GetRawTx = {
  blockHeightInput: string;
  blockHashInput: string;
  packedInput: string;
  address: string;
  contractAddress: string;
  functionName: string;
};

export const getRawTx = ({
  blockHeightInput,
  blockHashInput,
  packedInput,
  address,
  contractAddress,
  functionName,
}: GetRawTx) => {
  const rawTx = AElf.pbUtils.getTransaction(address, contractAddress, functionName, packedInput);
  rawTx.refBlockNumber = blockHeightInput;
  const blockHash = blockHashInput.match(/^0x/) ? blockHashInput.substring(2) : blockHashInput;
  rawTx.refBlockPrefix = Buffer.from(blockHash, 'hex').slice(0, 4);
  return rawTx;
};

type CreateHandleManagerForwardCall = {
  caContractAddress: string;
  contractAddress: string;
  args: any;
  methodName: string;
  caHash: string;
  instance: any;
};

const getSignature = async ({ provider, data }: { provider: IPortkeyProvider; data: string }) => {
  const signature = await provider.request({
    method: MethodsWallet.GET_WALLET_SIGNATURE,
    payload: { data },
  });
  if (!signature || signature.recoveryParam == null) return {}; // TODO
  const signatureStr = [signature.r, signature.s, `0${signature.recoveryParam.toString()}`].join('');
  return { signature, signatureStr };
};

export const handleTransaction = async ({
  blockHeightInput,
  blockHashInput,
  packedInput,
  address,
  contractAddress,
  functionName,
  provider,
}: any) => {
  // Create transaction
  const rawTx = getRawTx({
    blockHeightInput,
    blockHashInput,
    packedInput,
    address,
    contractAddress,
    functionName,
  });
  rawTx.params = Buffer.from(rawTx.params, 'hex');

  const ser = AElf.pbUtils.Transaction.encode(rawTx).finish();

  const m = AElf.utils.sha256(ser);
  // signature
  let signatureStr = '';
  const signatureRes = await getSignature({ provider, data: m });
  signatureStr = signatureRes.signatureStr || '';
  if (!signatureStr) return;

  let tx = {
    ...rawTx,
    signature: Buffer.from(signatureStr, 'hex'),
  };

  tx = AElf.pbUtils.Transaction.encode(tx).finish();
  if (tx instanceof Buffer) {
    return tx.toString('hex');
  }
  return AElf.utils.uint8ArrayToHex(tx); // hex params
};

export const createManagerForwardCall = async ({
  caContractAddress,
  contractAddress,
  args,
  methodName,
  caHash,
  instance,
}: CreateHandleManagerForwardCall) => {
  const res = await handleManagerForwardCall({
    paramsOption: {
      contractAddress,
      methodName,
      args,
      caHash,
    },
    functionName: 'ManagerForwardCall',
    instance,
  });
  res.args = Buffer.from(AElf.utils.uint8ArrayToHex(res.args), 'hex').toString('base64');

  const methods = await getContractMethods(instance, caContractAddress);
  const protoInputType = methods['ManagerForwardCall'];

  let input = AElf.utils.transform.transformMapToArray(protoInputType, res);

  input = AElf.utils.transform.transform(protoInputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);

  const message = protoInputType.fromObject(input);

  return protoInputType.encode(message).finish();
};

const getRawTransactionPortkey = async ({
  caHash,
  privateKey,
  contractAddress,
  caContractAddress,
  rpcUrl,
  params,
  methodName,
}: IRowTransactionPortkeyParams) => {
  try {
    const contract = await getContractBasic({
      callType: 'ca',
      caHash: caHash,
      account: aelf.getWallet(privateKey),
      contractAddress: contractAddress,
      caContractAddress: caContractAddress,
      rpcUrl: rpcUrl,
    });
    console.log('getRawTransaction Portkey caHash', caHash);
    console.log('getRawTransaction Portkey privateKey', privateKey);
    console.log('getRawTransaction Portkey contract', contract);

    const a = await contract.encodedTx(methodName, params);

    return a.data;
  } catch (error) {
    console.log('getRawTransaction error', error);

    return null;
  }
};

const getRawTransactionDiscover = async ({
  caAddress,
  contractAddress,
  caContractAddress,
  rpcUrl,
  params,
  methodName,
}: any) => {
  try {
    const instance = aelf.getAelfInstance(rpcUrl);

    console.log('getRawTransaction caAddress', caAddress);

    const rst = await did.services.communityRecovery.getHolderInfoByManager({
      caAddresses: [caAddress],
    } as any);
    const caHash: string = rst[0].caHash || '';

    console.log('getRawTransaction caHash', caHash);

    const managerForwardCall = await createManagerForwardCall({
      caContractAddress,
      contractAddress,
      caHash,
      methodName,
      args: params,
      instance,
    });

    const transactionParams = AElf.utils.uint8ArrayToHex(managerForwardCall);

    const aelfInstance = getAElf(rpcUrl);
    const { BestChainHeight, BestChainHash } = await aelfInstance.chain.getChainStatus();

    const provider = await deleteProvider();
    if (!provider) return;
    const fromManagerAddress = await provider.request({ method: MethodsWallet.GET_WALLET_CURRENT_MANAGER_ADDRESS });
    const transaction = await handleTransaction({
      blockHeightInput: BestChainHeight,
      blockHashInput: BestChainHash,
      packedInput: transactionParams,
      address: fromManagerAddress,
      contractAddress: caContractAddress,
      functionName: 'ManagerForwardCall',
      provider,
    });
    console.log('getRawTransaction transaction', transaction);
    return transaction;
  } catch (error) {
    return null;
  }
};

interface IRowTransactionPrams {
  walletInfo: WalletInfoType;
  walletType: WalletType;
  params: any;
  methodName: string;
  contractAddress: string;
  caContractAddress: string;
  rpcUrl: string;
  chainId: Chain;
}

export const getRawTransaction: (params: IRowTransactionPrams) => Promise<string | null> = async ({
  walletInfo,
  contractAddress,
  caContractAddress,
  methodName,
  walletType,
  params,
  rpcUrl,
  chainId,
}: IRowTransactionPrams) => {
  console.log('getRawTransaction params', rpcUrl, methodName, chainId, walletType);
  if (!rpcUrl || !chainId) return;

  let res = null;

  try {
    switch (walletType) {
      case WalletType.portkey:
        if (!walletInfo.portkeyInfo) return;
        res = await getRawTransactionPortkey({
          caHash: walletInfo.portkeyInfo.caInfo.caHash,
          privateKey: walletInfo.portkeyInfo.walletInfo.privateKey,
          contractAddress,
          caContractAddress,
          rpcUrl,
          params,
          methodName,
        });
        break;
      case WalletType.discover:
        if (!walletInfo.discoverInfo) return;
        res = await getRawTransactionDiscover({
          contractAddress,
          caAddress: walletInfo.discoverInfo.address,
          caContractAddress,
          rpcUrl,
          params,
          methodName,
        });
        break;
      case WalletType.elf:
        console.log('address', walletInfo.address);
        res = await getRawTransactionNight({
          contractAddress,
          params,
          chainId,
          account: walletInfo.address,
          methodName,
          rpcUrl,
        });
        break;
    }

    return res;
  } catch (error) {
    console.log('getRawTransaction error', error);

    return null;
  }
};
