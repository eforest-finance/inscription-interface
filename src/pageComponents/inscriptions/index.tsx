import Table from 'components/Table';
import { filterOptions, useInscriptionsList } from './useInsctiptionsList';
import getColumns from './columnConfig';
import styles from './styles.module.css';
import Segmented from 'components/Segmented';
import Button from 'components/Button';
import Input from 'components/Input';
import { useRouter } from 'next/navigation';
import { useWalletSyncCompleted, useWalletService } from 'hooks/useWallet';
import { Empty } from 'antd';
import useResponsive from 'hooks/useResponsive';

export default function Inscriptions() {
  const { tableProps, tab, search, searchChange, tabChange, inputIsError, clearFilter } = useInscriptionsList();
  const router = useRouter();
  const { isMobile } = useResponsive();
  const columns = getColumns(isMobile as boolean);
  const { getAccountInfoSync } = useWalletSyncCompleted();
  const { login, isLogin } = useWalletService();

  const jumpDeploy = async () => {
    if (!isLogin) {
      login();
      return;
    }
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) return;
    router.push('/deploy');
  };
  return (
    <div className={styles.inscriptions__container}>
      <div className={styles.inscriptions__title}>aelf Inscriptions</div>
      <div className="w-full mb-[24px] md:mb-[60px] lg:px-[216px]">
        <Input
          className="!h-[56px]"
          value={search}
          onChange={searchChange}
          status={inputIsError ? 'error' : undefined}
        />
      </div>
      {isMobile && (
        <div className="flex flex-row gap-4 w-full">
          <Button
            className="!w-full flex justify-center items-center !h-[56px]"
            type="primary"
            ghost
            onClick={() => {
              router.push('/latest');
            }}>
            Latest Inscriptions
          </Button>
          <Button className="!w-full flex justify-center items-center !h-[56px]" type="primary" onClick={jumpDeploy}>
            Deploy
          </Button>
        </div>
      )}
      <div className="md:pt-[80px] pt-6 text-[30px] leading-9 md:text-[40px] text-white md:leading-[48px] font-semibold">
        List of aelf inscriptions
      </div>
      <div className="my-8 w-full flex items-center justify-between">
        <div>
          <Segmented value={tab} onChange={tabChange} options={filterOptions} />
        </div>
        {!isMobile && (
          <div className="flex w-full flex-row justify-end mb-0">
            <Button
              className="pcMin:!w-[200px] !w-full flex justify-center items-center !h-[56px]"
              type="primary"
              ghost
              onClick={() => {
                router.push('/latest');
              }}>
              Latest Inscriptions
            </Button>
            <Button
              className="pcMin:!w-[200px] !w-full flex justify-center items-center !h-[56px] mb-4 pcMin:mb-0 mt-2 pcMin:mt-0 pcMin:ml-4"
              type="primary"
              onClick={jumpDeploy}>
              Deploy
            </Button>
          </div>
        )}
      </div>

      <Table
        rowKey="symbol"
        locale={{
          emptyText: (
            <div className={styles.empty__table}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{
                  height: !search ? 80 : 0,
                }}
                description={
                  <div className="text-white text-[16px] font-medium leading-[24px] mt-[8px]">
                    {search ? 'No Inscription found for this search' : 'No Inscription yet'}
                  </div>
                }>
                {search && (
                  <Button
                    className="!px-[16px] !py-[24px] !h-[56px] !flex !items-center"
                    type="primary"
                    onClick={clearFilter}>
                    Back to All Inscriptions
                  </Button>
                )}
              </Empty>
            </div>
          ),
        }}
        showHeader={!isMobile}
        scroll={{ x: 'max-content' }}
        showLottie={false}
        onRow={(record) => {
          return {
            onClick: () => {
              router.push(`/inscription-detail?tick=${record.tick}`);
            },
          };
        }}
        columns={columns}
        {...tableProps}></Table>
    </div>
  );
}
