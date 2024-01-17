'use client';
import { useEffect, useRef, useState } from 'react';
import { Form, Button, Select, Input, Divider, AutoComplete, message } from 'antd';
import { AWSUpload } from './awsUpload/Upload';
// import { ReactComponent as LoadingSvg } from 'assets/images/loading.svg';
import { useModal, CreateTokenSuccessModal } from './modal';
import LoadingModal from 'components/LoadingModal';
import { SymbolSelect } from './Select/Select';
import BigNumber from 'bignumber.js';
import { addPrefixSuffix, decodeAddress, getOriginalAddress } from 'utils/addressFormatting';
import styles from './style.module.css';
import { useCreateService } from './hooks/useCreateService';
import { useSelector } from 'redux/store';
import { getDecimalsSupply, sleep } from 'utils/common';
import { SupportedELFChainId } from 'types';
import { useCheckLoginAndToken, useWalletSyncCompleted } from 'hooks/useWallet';
import { debounce } from 'lodash-es';
import { ReactComponent as Close } from 'assets/images/search-close.svg';
import { ReactComponent as ArrowDown } from 'assets/images/down-arrow-thin.svg';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as ARROWLEFTUP } from 'assets/images/arrow-left-up.svg';
import { InputNumberCustom } from './InputNumberCustom';

export default function Create() {
  const [loading, setLoading] = useState(false);
  const [disabledStatus, setDisableStatus] = useState(true);
  // const [seedInfo, setSeedInfo] = useState<ISeedInfo>();
  const seedInfo = useRef<ISeedInfo>();
  const { walletInfo } = useSelector((store) => store.userInfo);

  const { curChain } = useSelector((store) => store.elfInfo.elfInfo);

  const [form] = Form.useForm();

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({
    issueChain: curChain,
    symbol: '',
    tokenName: '',
    isBurnable: '1',
  });

  const [issuerBelongChain, setIssuerBelongChain] = useState<string>('');

  const { isMobile } = useResponsive();

  const niceModal = useModal(CreateTokenSuccessModal);
  const loadModal = useModal(LoadingModal);
  const { create } = useCreateService();
  const { isOK, checkLogin } = useCheckLoginAndToken();

  const { getAccountInfoSync } = useWalletSyncCompleted();

  const submitForm = async (values: any) => {
    if (!isOK) {
      checkLogin();
      return;
    }
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) return;
    loadModal.show();

    const totalSupply = getDecimalsSupply(formValues.totalSupply, formValues.decimals);
    const params: ICreateTokenParams = {
      ...formValues,
      tokenName: String(formValues?.tokenName || '').trim(),
      symbol: seedInfo.current?.symbol || '',
      seedSymbol: seedInfo.current?.seedSymbol || '',
      isBurnable: values.isBurnable == '1' ? true : false,
      owner: mainAddress,
      totalSupply,
    };

    delete params.tokenImage;

    try {
      await create(params, values.tokenImage);
      await sleep(10000);
      loadModal.hide();
      niceModal.show({
        seedName: seedInfo.current?.seedName,
        symbol: seedInfo.current?.symbol,
        tokenImage: values.tokenImage,
      });
    } catch (err) {
      console.error(err, 'err');
      loadModal.hide();
    }
  };

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    return e?.fileUrl;
  };

  const checkSubmitStatus = (values: any) => {
    const res = [
      'symbol',
      'tokenName',
      'decimals',
      'totalSupply',
      'issueChain',
      'issuer',
      'isBurnable',
      'tokenImage',
    ].every((key) => !!(values[key] as unknown as string));
    setDisableStatus(!res);
    setTimeout(() => {
      const hasError = form.getFieldsError().filter(({ errors }) => errors.length).length > 0;
      setDisableStatus(!res || hasError);
    });
  };
  useEffect(() => {
    checkSubmitStatus(formValues);
  }, [formValues]);

  const checkIssuerChange = (values: any) => {
    const issuerObj: { issuer?: any } = {};
    if ('issuer' in values) {
      const address = values.issuer;
      if (address && address.indexOf('_') > -1) {
        const parts = address.split('_');
        if (parts[0] === 'ELF' || parts[1] === formValues.issueChain || parts[2] === formValues.issueChain) {
          if (address.startsWith('ELF')) {
            setIssuerBelongChain(parts[2]);
            form.setFieldValue('issuer', parts[1]);
          } else {
            setIssuerBelongChain(parts[1]);
            form.setFieldValue('issuer', parts[0]);
          }
        } else {
          setIssuerBelongChain('');
        }
      } else {
        setIssuerBelongChain('');
      }
      issuerObj.issuer = getOriginalAddress(address);
    }
    return issuerObj;
  };

  const onValuesChange = (values: any, allValues: any) => {
    const issuerObj = checkIssuerChange(values);
    setFormValues({ ...formValues, ...allValues, ...issuerObj });
  };

  const upLoadingStatus = (value?: string) => {
    if (value === 'uploading') {
      setLoading(true);
    }
    if (value === 'done') {
      setLoading(false);
    }
  };

  const renderOptionItem = () => {
    const address =
      formValues.issueChain === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;
    if (!address) return [];

    const showAddress = addPrefixSuffix(address, formValues.issueChain as unknown as Chain);

    return {
      value: address,
      label: (
        <div className="flex flex-col text-left text-white border border-primary-color">
          <span className="text-xs text-[#796F94]">My Address</span>
          <div className="flex justify-between">
            <span className="break-all flex-1 !whitespace-normal">{showAddress}</span>
            <ARROWLEFTUP className="w-4 h-4 ml-2 mt-1" />
          </div>
        </div>
      ),
    };
  };

  const options = [renderOptionItem()];

  const getTooltipProps = (title: string) => {
    return {
      title,
      color: '#26242C',
      // getPopupContainer: () => document.body,
      overlayInnerStyle: {
        maxWidth: '320px',
        minWidth: '260px',
        borderRadius: '8px',
        padding: '4px 8px',
        color: 'white',
        fontSize: '12px',
        lineHeight: '20px',
      },
    };
  };

  return (
    <Form
      layout="vertical"
      size="large"
      className={`${styles['elf-form-vertical-custom']} max-w-[700px] !mx-auto !pt-[24px]`}
      form={form}
      initialValues={formValues}
      onValuesChange={onValuesChange}
      onFinish={debounce(submitForm, 1000, {
        leading: true,
        trailing: false,
      })}>
      <h1 className="text-[24px] text-white my-0 font-bold leading-normal">Create New Token</h1>
      <p className="text-[#796F94] text-[12px] mb-[24px] leading-normal">Create a Token using your SEED</p>
      <Form.Item
        name="symbol"
        tooltip={getTooltipProps(
          "The unique identifier of the token you're creating. Each token has an exclusive symbol, ensuring uniqueness.",
        )}
        label="Token Symbol"
        required
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(new Error('Please select your token symbol'));
              }
              // console.log(seedInfo, 'setSeedInfo');
              if (seedInfo.current?.chainId !== SupportedELFChainId.MAIN_NET) {
                return Promise.reject(
                  new Error(`Can't create the token. Please transfer this SEED to MainChain AELF before you continue.`),
                );
              }
              return Promise.resolve();
            },
          }),
        ]}>
        <SymbolSelect
          defaultValue={formValues.symbol}
          onSelectData={(data) => {
            console.log('setSeedInfo!!!!', data);
            if (!data) {
              console.log('setSeedInfo init');
              setFormValues({
                ...formValues,
                symbol: '',
              });
              seedInfo.current = undefined;
              // setSeedInfo(undefined);
              return;
            }
            // setSeedInfo(data);
            seedInfo.current = data;
            setFormValues({
              ...formValues,
              symbol: data.symbol,
            });
          }}
        />
      </Form.Item>
      <Form.Item
        name="tokenName"
        label="Name"
        tooltip={getTooltipProps(
          "The name of the token you're creating. Unlike token symbols, token names are not exclusive, meaning different tokens may share the same name.",
        )}
        rules={[
          {
            required: true,
            message: 'Please input token name!',
          },
        ]}>
        <Input
          className={isMobile ? styles['input-affix-wrapper-m'] : ''}
          placeholder="Enter a token name"
          maxLength={80}
          autoComplete={'off'}
          allowClear={{
            clearIcon: isMobile ? (
              <div className={styles['close-icon-bg']}>
                <Close className="leading-none" />
              </div>
            ) : (
              <Close className="leading-none" />
            ),
          }}></Input>
      </Form.Item>
      <Form.Item
        name="decimals"
        label="Decimals"
        tooltip={getTooltipProps(
          'The number of decimal places that the token can be divided into. Please enter a value no more than 18.',
        )}
        required
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(new Error('Please input Decimals'));
              }
              if (!/^[0-9][0-9]*$/.test(value)) {
                return Promise.reject(new Error('Please enter a positive whole number'));
              }
              if (Number(value) > 18) {
                return Promise.reject(new Error('The decimals must be no more than 18'));
              }
              return Promise.resolve();
            },
          }),
        ]}>
        <Input
          placeholder="Example: 8"
          className={styles[isMobile ? 'decimals-input-m' : 'decimals-input']}
          autoComplete={'off'}
          allowClear={{
            clearIcon: isMobile ? (
              <div className={styles['close-icon-bg']}>
                <Close className="leading-none" />
              </div>
            ) : (
              <Close className="leading-none" />
            ),
          }}></Input>
      </Form.Item>
      <Form.Item
        name="totalSupply"
        label="Total Supply"
        tooltip={getTooltipProps(
          'The maximum quantity of tokens that can be issued. Please enter a numerical value with a maximum of 19 digits, including both whole number and decimal digits.',
        )}
        dependencies={['decimals']}
        required
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(new Error('Please input your Total Supply'));
              }
              if (!/^[1-9][0-9]*$/.test(value)) {
                return Promise.reject(new Error('Please enter a positive whole number'));
              }
              if (
                new BigNumber(value)
                  .multipliedBy(Math.pow(10, formValues.decimals || 0))
                  .gt(new BigNumber('9223372036854775807'))
              ) {
                return Promise.reject(
                  new Error(
                    `The total supply must be a positive whole number between 0 and ${new BigNumber(
                      '9223372036854775807',
                    )
                      .dividedToIntegerBy(Math.pow(10, formValues.decimals || 0))
                      .toFormat({ groupSeparator: ',', groupSize: 3 })}`,
                  ),
                );
              }
              return Promise.resolve();
            },
          }),
        ]}>
        <InputNumberCustom />
      </Form.Item>
      <Form.Item
        name="issueChain"
        label="Blockchain"
        tooltip={getTooltipProps(
          'The blockchain where the token will be created. Please note: Token issuance will also occur on this blockchain.',
        )}
        rules={[
          {
            required: true,
            message: 'Please select your chain',
          },
        ]}>
        <Select
          placeholder="Please select issuer chain"
          suffixIcon={<ArrowDown />}
          popupClassName={styles['select-custom']}>
          <Select.Option value={curChain}>SideChain {curChain}</Select.Option>
          <Select.Option value="AELF">MainChain AELF</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="issuer"
        label="Issuer"
        tooltip={getTooltipProps(
          "The address that has right to issue the token you're creating. Please note: Token issuance must be conducted by this address.",
        )}
        required
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(new Error('Please input issuer address'));
              }
              if (!decodeAddress(value) || (!!issuerBelongChain && issuerBelongChain !== formValues.issueChain)) {
                return Promise.reject(
                  new Error(
                    `Please enter a correct address on ${
                      formValues.issueChain === 'AELF' ? 'MainChain' : 'SideChain'
                    } ${formValues.issueChain}.`,
                  ),
                );
              }
              return Promise.resolve();
            },
          }),
        ]}>
        <AutoComplete popupClassName="border border-solid border-primary-color !rounded-md" options={options}>
          <Input
            autoComplete="off"
            allowClear={{
              clearIcon: isMobile ? (
                <div className={styles['close-icon-bg']}>
                  <Close className="leading-none" />
                </div>
              ) : (
                <Close className="leading-none" />
              ),
            }}
            className={styles[isMobile ? 'des-address-m' : 'des-address']}
            prefix={<div className={styles['efl-prefix']}>ELF</div>}
            suffix={<div className={styles['tDVV-prefix']}>{formValues.issueChain}</div>}
            placeholder="Enter issuer address"></Input>
        </AutoComplete>
      </Form.Item>
      <Form.Item
        name="isBurnable"
        label="Burnable"
        tooltip={getTooltipProps(
          "Whether the token you're creating can be burned. Please note: Unburnable tokens cannot be internally transferred across chains within the aelf blockchain, such as between the MainChain and SideChains.",
        )}
        rules={[
          {
            required: true,
            message: 'Please select your burnable',
          },
        ]}>
        <Select suffixIcon={<ArrowDown />} popupClassName={styles['select-custom']} defaultValue="1">
          <Select.Option value="1">Yes</Select.Option>
          <Select.Option value="0">No</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.isBurnable !== currentValues.isBurnable}>
        {({ getFieldValue }) => {
          return getFieldValue('isBurnable') == '0' ? (
            <div className="mt-[-16px] mb-4">
              <span className="text-[#796F94] font-normal text-xs leading-[18px]">{`Unburnable tokens can't be transferred cross-chain.`}</span>
            </div>
          ) : null;
        }}
      </Form.Item>
      <Form.Item
        name="tokenImage"
        label="Token Logo"
        tooltip={getTooltipProps(
          "The logo of the token you're creating. The data is stored off the blockchain and other DApps may access your token logo.",
        )}
        valuePropName="fileUrl"
        getValueFromEvent={normFile}
        rules={[
          {
            required: true,
            message: 'Please input your image',
          },
        ]}>
        <AWSUpload upLoadingStatus={upLoadingStatus} />
      </Form.Item>

      <Divider dashed={true} className="border-[#231F30]" />

      <Form.Item>
        <Button
          disabled={loading || disabledStatus}
          type="primary"
          htmlType="submit"
          className="w-full h-[52px] pcMin:max-w-[206px] !rounded-md">
          {'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
}
