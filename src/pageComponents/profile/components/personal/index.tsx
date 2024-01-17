import Image from 'next/image';
import styles from './style.module.css';
import SMLoading from 'assets/images/smLoading.png';
import Copy from 'components/Copy';
import { memo, useCallback, useEffect, useState } from 'react';
import useUserInfo from 'hooks/useUserInfo';
import { logOutUserInfo } from 'redux/reducer/userInfo';
import { useSelector } from 'react-redux';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useGetAccount } from 'aelf-web-login';
import { useRequest } from 'ahooks';
import { SupportedELFChainId } from 'types';
import { Popover, Space } from 'antd';
import elfIcon from 'components/ELFLogo';
import { ReactComponent as DownArrow } from 'assets/images/down-arrow-thin.svg';

const avatar = '/aelfinscription/images/avatar.png';

function ELFAddress({
  address,
  host,
  chain,
  loading,
}: {
  address: string;
  host: string;
  chain: Chain;
  loading?: boolean;
}) {
  const prefix = chain === SupportedELFChainId.MAIN_NET ? 'MainChain' : 'SideChain';

  const renderLoading = () => {
    return (
      <span className="flex items-center">
        <Image className="w-3 h-3 mr-2 animate-spin" width={12} height={12} src={SMLoading} alt="loading icon" />
        <span className="text-white text-sm leading-6">Synchronizing data on the blockchain…</span>
      </span>
    );
  };

  const renderAddress = () => {
    return (
      <span className="flex items-start">
        <span
          className="cursor-pointer text-sm flex-1 max-w-[264px] text-white font-medium break-all hover:text-primary-color-hover transition-all"
          onClick={() => {
            window.open(`${host}/address/${address}`);
          }}>
          {address}
        </span>
        <span className={styles.action}>
          <Copy className="ml-2" value={address} />
        </span>
      </span>
    );
  };

  return (
    <div className={styles.address}>
      <span className="text-xs text-[#796F94] mr-1">{`${prefix} Address:`}</span>
      {!loading ? renderAddress() : renderLoading()}
    </div>
  );
}

function Personal() {
  const getAccountInAELF = useGetAccount('AELF');
  const { run, data, cancel } = useRequest(getAccountInAELF, {
    manual: true,
    pollingInterval: 3000,
  });
  const { getUserInfo } = useUserInfo();
  const [userInfo, setUserInfo] = useState<UserInfoType | IUsersAddressRes>(logOutUserInfo);
  const [openAddress, setOpenAddress] = useState<boolean>(false);

  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const info = useSelector((store: any) => store.elfInfo.elfInfo);

  const [loadingMainAddress, setLoadingMainAddress] = useState<boolean>(false);
  const [MainChainAddress, setMainAddress] = useState<string>('');

  const getUser = useCallback(async () => {
    const res = await getUserInfo();
    setUserInfo(res);
  }, [getUserInfo]);
  useEffect(() => {
    if (!walletInfo.address) return;
    getUser();
  }, [getUser]);

  useEffect(() => {
    const address = data || walletInfo.aelfChainAddress;
    if (address) {
      cancel();
      setMainAddress(address);
      setLoadingMainAddress(false);
    } else {
      run();
      setLoadingMainAddress(true);
    }
  }, [data, walletInfo.aelfChainAddress]);

  return (
    <div className={styles.personal}>
      <div className={styles.avatar}>
        <Image
          width={96}
          height={96}
          className={styles.avatar__img}
          alt="avatar"
          src={userInfo.profileImage || avatar}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.uname}>{userInfo.name || 'Unname'}</div>
        <Popover
          trigger="click"
          content={
            <div className="bg-dark-bgc">
              <ELFAddress
                host={info.MainExplorerURL}
                chain="AELF"
                address={addPrefixSuffix(MainChainAddress || '', 'AELF')}
                loading={loadingMainAddress}
              />
              <div className="h-[1px] bg-dark-border-default my-4 -mx-4"></div>
              <ELFAddress host={info.SideExplorerURL} chain={info.curChain} address={userInfo.fullAddress} />
            </div>
          }
          title={null}
          placement="bottomLeft"
          autoAdjustOverflow={false}
          onOpenChange={(open) => setOpenAddress(open)}
          showArrow={false}>
          <span className="flex w-auto items-center text-white transition-all hover:text-primary-color-hover cursor-pointer mt-2">
            <Space>
              <Image src={elfIcon} width={16} height={16} alt="elf icon"></Image>
              View My Addresses
              <div className="w-4 h-4">{!openAddress ? <DownArrow /> : <DownArrow className="rotate-180" />}</div>
            </Space>
          </span>
        </Popover>
      </div>
    </div>
  );
}

export default memo(Personal);
