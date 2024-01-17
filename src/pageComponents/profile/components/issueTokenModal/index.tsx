import { Button, Form, Input, ModalProps, AutoComplete } from 'antd';
import Modal from 'components/Modal';
import { ChangeEvent, memo, useCallback, useMemo, useRef, useState } from 'react';
import styles from './style.module.css';
import { divideDecimalsSupply, getDecimalsSupply, sleep, thousandsNumber } from 'utils/common';
import clsx from 'clsx';
import { FormInstance } from 'antd/es/form/Form';
import { ReactComponent as CloseBtn } from 'assets/images/close-white.svg';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { addPrefixSuffix, decodeAddress } from 'utils/addressFormatting';
import elfIcon from 'assets/images/elf-icon.svg';
import { useCreateService } from 'pageComponents/create/hooks/useCreateService';
import LoadingModal from 'components/LoadingModal';
import { SupportedELFChainId } from 'types';
import { useHiddenModal } from 'hooks/useHiddenModal';
import Image from 'next/image';
import { ReactComponent as ARROWLEFTUP } from 'assets/images/arrow-left-up.svg';
import { useSelector } from 'redux/store';
import { InputNumberCustom } from 'pageComponents/create/InputNumberCustom';

interface IModalProps
  extends Omit<
    ModalProps,
    'children' | 'getContainer' | 'centered' | 'onOk' | 'footer' | 'title' | 'afterClose' | 'open'
  > {
  tokenInfo: IMyTokenInfo;
}

export type FormType = {
  Amount: string;
  address: string;
};

export enum TokenModalStatus {
  success,
}

export interface ITokenModalRes {
  status: TokenModalStatus;
  data: FormType;
  info: IMyTokenInfo;
}

const IssueTokenModal = NiceModal.create((props: IModalProps) => {
  const modal = useModal();
  const { tokenInfo }: { tokenInfo: IMyTokenInfo } = props;
  const { issueChain, originIssueChain } = tokenInfo;
  const [disabled, setDisabled] = useState<boolean>(true);
  const formRef = useRef<FormInstance>(null);
  const { walletInfo } = useSelector((store) => store.userInfo);
  const issuerAddressBelongChain = useRef<string>('');

  const loadingModal = useModal(LoadingModal);
  localStorage.removeItem('issueToken');
  useHiddenModal(modal);
  const { issue } = useCreateService();
  const onFinish = useCallback(
    async (values: FormType) => {
      loadingModal.show();
      try {
        await issue(
          {
            symbol: tokenInfo.symbol,
            amount: getDecimalsSupply(Number(values.Amount), tokenInfo.decimals),
            memo: '3',
            to: values.address,
          },
          tokenInfo.issuer,
          tokenInfo.originIssueChain as Chain,
        );
        await sleep(8000);
        modal.resolve({
          status: TokenModalStatus.success,
          data: values,
          info: tokenInfo,
        });
        loadingModal.hide();
        modal.hide();
      } catch (error) {
        modal.hide();
        loadingModal.hide();
      }
    },
    [modal, issue, tokenInfo, loadingModal],
  );

  const onCancel = () => {
    formRef.current && formRef.current.resetFields();
    modal.hide();
  };

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }, []);

  const validAddress = useCallback(
    (value: string) => {
      if (!value) {
        return Promise.reject(new Error('Please input your address!'));
      } else if (!decodeAddress(value)) {
        return Promise.reject(new Error('Please enter a valid aelf address'));
      } else if (!!issuerAddressBelongChain.current && issuerAddressBelongChain.current !== originIssueChain) {
        return Promise.reject(
          new Error(
            `Please enter a correct address on ${
              originIssueChain === 'AELF' ? 'MainChain' : 'SideChain'
            } ${originIssueChain}.`,
          ),
        );
      }
      return Promise.resolve();
    },
    [issuerAddressBelongChain, originIssueChain],
  );

  const validAmount = useCallback(
    (value: string) => {
      const supply = divideDecimalsSupply(tokenInfo.totalSupply - tokenInfo.currentSupply, tokenInfo.decimals);
      if (!value) {
        return Promise.reject(new Error('Please input your Amount!'));
      } else if (!/^[1-9][0-9]*$/.test(value)) {
        return Promise.reject(new Error('Please enter a positive whole number'));
      } else if (Number(value) > supply) {
        return Promise.reject(
          new Error(`The maximum amount that can be issued: ${String(supply).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`),
        );
      }
      return Promise.resolve();
    },
    [tokenInfo],
  );

  const addressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value;
    issuerAddressBelongChain.current = '';
    if (decodeAddress(address)) {
      if (address.indexOf('_') > -1) {
        const parts = address.split('_');
        if (
          parts[0] === 'ELF' ||
          parts[1] === SupportedELFChainId.TDVV_NET ||
          parts[2] === SupportedELFChainId.TDVV_NET
        ) {
          if (address.startsWith('ELF')) {
            formRef.current && formRef.current.setFieldValue('address', parts[1]);
            issuerAddressBelongChain.current = parts[2];
          } else {
            formRef.current && formRef.current.setFieldValue('address', parts[0]);
            issuerAddressBelongChain.current = parts[1];
          }
        }
      }
    }
  };

  const onValuesChange = useCallback(
    async (changedValues: keyof FormType, allValues: FormType) => {
      if (Object.values(allValues).some((item) => !item)) {
        setDisabled(true);
      } else {
        const address = allValues.address;
        if (
          decodeAddress(address) &&
          ((issuerAddressBelongChain.current && originIssueChain === issuerAddressBelongChain.current) ||
            !issuerAddressBelongChain.current)
        ) {
          setDisabled(false);
        } else {
          setDisabled(true);
        }
        try {
          await validAmount(allValues.Amount);
        } catch (error) {
          setDisabled(true);
        }
      }
    },
    [validAmount, originIssueChain],
  );

  const renderOptionItem = () => {
    const address =
      originIssueChain === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;
    if (!address) return [];

    const showAddress = addPrefixSuffix(address, originIssueChain as unknown as Chain);

    return {
      value: address,
      label: (
        <div className="flex flex-col text-left text-white border border-primary-color">
          <span className="text-xs text-[#796F94]">My Address</span>
          <div className="flex">
            <span className="break-all flex-1 !whitespace-normal">{showAddress}</span>
            <ARROWLEFTUP className="w-4 h-4 ml-2 mt-1" />
          </div>
        </div>
      ),
    };
  };

  //const options = [{ label: renderOptionTitle('My address'), options: [renderOptionItem()] }];
  const options = [renderOptionItem()];

  const footer = useMemo(() => {
    return (
      <div className={styles.token__footer}>
        <Form
          name="basic"
          ref={formRef}
          size="large"
          layout="vertical"
          className="elf-form-vertical-custom"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          onFinishFailed={onFinishFailed}>
          <Form.Item
            label="Issue Amount"
            name="Amount"
            required
            rules={[
              () => ({
                validator(_, value) {
                  return validAmount(value);
                },
              }),
            ]}>
            <InputNumberCustom placeholder="Example: 1,000" />
          </Form.Item>

          <Form.Item
            label="On-chain Address"
            name="address"
            required
            rules={[
              () => ({
                validator(_, value) {
                  return validAddress(value);
                },
              }),
            ]}>
            <AutoComplete popupClassName={styles['input-tip']} options={options}>
              <Input
                className={clsx(styles['des-address'], 'caret-primary-color')}
                onChange={addressChange}
                autoComplete="off"
                prefix={<div className={styles['efl-prefix']}>ELF</div>}
                suffix={<div className={styles['tDVV-prefix']}>{originIssueChain}</div>}
                allowClear={{ clearIcon: <CloseBtn className="closeIcon" /> }}
                placeholder="Issued to"
              />
            </AutoComplete>
          </Form.Item>

          <Form.Item className="!mb-0 !mt-12">
            <Button
              className="w-full !box-border !px-6 !font-bold text-base !leading-6 !h-[52px] !py-3 text-white !rounded-md"
              type="primary"
              disabled={disabled}
              htmlType="submit">
              Issue
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }, [originIssueChain, validAddress, disabled, onFinish, onFinishFailed, validAmount, onValuesChange]);
  return (
    <Modal
      width={680}
      className="h-[637px]"
      centered
      title="Issue Token"
      getContainer={false}
      footer={footer}
      open={modal.visible}
      onCancel={onCancel}
      onOk={() => modal.hide()}
      afterClose={() => modal.remove()}
      {...props}>
      <div className={styles.tokenMain}>
        <header className="flex mb-4 items-center">
          <Image
            width={48}
            height={48}
            className="w-16 h-16 mr-4 object-cover rounded-full"
            src={tokenInfo?.tokenImage || elfIcon}
            alt="seed-img"
          />
          <div className="flex items-center text-base font-bold leading-6 text-white flex-1 w-0">
            {<span className="truncate">{tokenInfo.tokenName}</span>}(
            {<span className="block max-w-[70px] truncate flex-shrink-0">{tokenInfo?.symbol}</span>})
          </div>
        </header>
        <div className={styles.supply}>
          <div className={styles.supply__item}>
            <div className={styles.label}>Total Supply</div>
            <div className={styles.value}>
              {thousandsNumber(divideDecimalsSupply(tokenInfo?.totalSupply as number, tokenInfo.decimals))}
            </div>
          </div>
          <div className={clsx(styles.supply__item, 'mt-2')}>
            <div className={styles.label}>Current Supply</div>
            <div className={styles.value}>
              {thousandsNumber(divideDecimalsSupply(tokenInfo?.currentSupply as number, tokenInfo.decimals))}
            </div>
          </div>
          <div className={clsx(styles.supply__item, 'mt-2')}>
            <div className={styles.label}>Issue Chain</div>
            <div className={styles.value}>{issueChain}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default memo(IssueTokenModal);
