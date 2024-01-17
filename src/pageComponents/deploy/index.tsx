import HeaderBack from 'components/HeaderBack';
import styles from './style.module.css';
import { debounce } from 'lodash-es';
import { Form, Input, Upload, message, Image } from 'antd';
import { SymbolSelect } from 'pageComponents/create/Select/Select';
import formStyles from './style.module.css';
import { ReactComponent as Close } from 'assets/images/search-close.svg';
import Button from 'components/Button';
import Copy from 'components/Copy';
import clsx from 'clsx';
import CodeBlock from '../../components/CodeBlock/index';
import { useCopyToClipboard } from 'react-use';
import { ReactComponent as UploadOutlined } from 'assets/inscription/upload.svg';
import { ReactComponent as Album } from 'assets/inscription/album.svg';
import { SetStateAction, useCallback, useMemo, useRef, useState } from 'react';
import { useWalletService, useWalletSyncCompleted } from 'hooks/useWallet';
import { useModal } from '@ebay/nice-modal-react';
import BigNumber from 'bignumber.js';
import { useJumpTsm } from 'hooks/useJumpTsm';
import { INSCRIPTION_CONTRACT_NAME } from 'utils/contant';
import AsyncDeployModal from './asyncDeployModal';
interface IFromValues {
  p: string;
  op: string;
  limit: string;
  tick: string;
  max: string;
}

export default function Deploy() {
  const [, copyToClipboard] = useCopyToClipboard();
  const getBase64 = useCallback((img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }, []);
  const [deployForm, setDeployForm] = useState<IFromValues>({
    p: INSCRIPTION_CONTRACT_NAME,
    op: 'deploy',
    tick: '',
    max: '',
    limit: '',
  });
  const handleCopy = () => {
    try {
      copyToClipboard(JSON.stringify(deployForm));
      message.success('Copied Successfully');
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };
  const [ImageUrl, setImageUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const errorMessage = () => {
    message.error('Image must smaller than 6kb!');
    setUploadLoading(false);
  };
  const beforeUpload = (e: File) => {
    console.log(e, 'e');
    setUploadLoading(true);
    if (e.size > 1024 * 6) {
      errorMessage();
      return false;
    } else {
      getBase64(e, (imageUrl: SetStateAction<string>) => {
        setImageUrl(imageUrl as string);
        setFileName(e.name);
        setUploadLoading(false);
      });
      return false;
    }
  };
  const onValuesChange = (values: any) => {
    const form = {
      ...deployForm,
      ...values,
    };
    form.tick = form.tick.split('-')[0];
    setDeployForm(form);
  };

  const seedInfo = useRef<ISeedInfo>();

  const disabledButton = useMemo(() => {
    return !Object.values(deployForm).every((item) => !!item) || !ImageUrl || uploadLoading;
  }, [deployForm, ImageUrl, uploadLoading]);
  const { getAccountInfoSync } = useWalletSyncCompleted();
  const asyncDeployModal = useModal(AsyncDeployModal);

  const jumpTsm = useJumpTsm();
  const { login, isLogin } = useWalletService();
  const submitForm = async () => {
    if (!isLogin) {
      login();
      return;
    }
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) return;
    const params = {
      seedSymbol: seedInfo.current?.seedSymbol || '',
      tick: deployForm.tick,
      image: ImageUrl,
      max: BigNumber(deployForm.max).toNumber(),
      limit: BigNumber(deployForm.limit).toNumber(),
    };
    asyncDeployModal.show({ params });
  };
  return (
    <div className={styles.deploy_container}>
      <HeaderBack />
      <Form
        layout="vertical"
        size="large"
        className={`${formStyles['elf-form-vertical-custom']}`}
        onValuesChange={onValuesChange}
        onFinish={debounce(submitForm, 1000, {
          leading: true,
          trailing: false,
        })}>
        <Form.Item label="Inscription icon" required>
          <Upload
            name="File"
            accept=".jpeg,.jpg,.png"
            action={''}
            maxCount={1}
            beforeUpload={beforeUpload}
            showUploadList={false}>
            <Button className={styles.upload_button} type="primary" ghost icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
          <div className="text-base text-white font-medium my-6">Upload image or drop it here</div>
          <div className="text-dark-caption font-medium text-sm mb-10">
            <div>Recommended size: 350 x 350</div>
            <div>Formats supported: JPG, PNG</div>
          </div>
          <div className="preview_box w-[200px] h-[200px]">
            {ImageUrl ? (
              <Image width={200} height={200} className="w-full h-full rounded-[12px] object-cover" src={ImageUrl} />
            ) : (
              <div className="preview_img_box w-full rounded-[12px] h-full bg-dark-bgc-hover flex items-center justify-center">
                <Album />
              </div>
            )}
          </div>
          <div className="mt-4 text-dark-caption font-medium text-sm">{fileName}</div>
        </Form.Item>
        <Form.Item
          name="tick"
          label="Inscription Name (Tick)"
          required
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('Please select your token symbol'));
                }
                return Promise.resolve();
              },
            }),
          ]}>
          <SymbolSelect
            chainID="AELF"
            seedType={1}
            notFoundContent={
              <div>
                <div className="text-dark-caption text-center">No SEED found.</div>
                <div className="text-dark-caption text-center">
                  Inscription deployment requires SEEDs with NFT tag (with suffix -0), which can be acquired via Symbol
                  Market. Symbol associated with the SEED is your inscription tick.
                </div>
                <div
                  className="text-primary-color text-[16px] text-center leading-[24px] mt-[16px]"
                  onClick={() => {
                    jumpTsm();
                  }}>
                  Go to Symbol Market
                </div>
              </div>
            }
            placeholder="Please select the inscription tick (symbol associated with your SEED)"
            onSelectData={(data) => {
              console.log('setSeedInfo!!!!', data);
              if (!data) {
                console.log('setSeedInfo init');
                seedInfo.current = undefined;
                return;
              }
              // setSeedInfo(data);
              seedInfo.current = data;
            }}
          />
        </Form.Item>
        <Form.Item
          name="max"
          label="Total Supply"
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

                if (new BigNumber(value).gt(new BigNumber('9223372036854775807'))) {
                  return Promise.reject(
                    new Error(
                      `The total supply must be a positive whole number between 0 and ${new BigNumber(
                        '9223372036854775807',
                      )}`,
                    ),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}>
          <Input
            placeholder="Please enter numbers"
            autoComplete={'off'}
            allowClear={{
              clearIcon: <Close className="leading-none" />,
            }}></Input>
        </Form.Item>
        <Form.Item
          name="limit"
          label="Limit per Mint"
          dependencies={['max']}
          required
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('Please input your Limit Amount'));
                }
                if (!/^[1-9][0-9]*$/.test(value)) {
                  return Promise.reject(new Error('Please enter a positive whole number'));
                }
                if (new BigNumber(value).gt(new BigNumber(deployForm.max))) {
                  return Promise.reject(new Error('Limit per mint must not exceed the total supply'));
                }
                return Promise.resolve();
              },
            }),
          ]}>
          <Input
            placeholder="Please enter the maximum amount that can be minted each time"
            autoComplete={'off'}
            allowClear={{
              clearIcon: <Close className="leading-none" />,
            }}></Input>
        </Form.Item>
        <Form.Item>
          <div>
            <div className="flex justify-between items-center inscription__title mb-4">
              <span className="text-lg leading-[26px] font-medium text-white">Inscription</span>
              <Button
                className={clsx('flex !h-10 items-center rounded-[12px] justify-center', styles.copy_button)}
                onClick={handleCopy}
                type="primary"
                ghost>
                <Copy value={JSON.stringify(deployForm)} />
                <span className="ml-2 font-medium">Copy Code</span>
              </Button>
            </div>
            <CodeBlock rows={7} value={JSON.stringify(deployForm)} />
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            disabled={disabledButton}
            htmlType="submit"
            className="w-[156px] text-base font-semibold !h-[56px] !rounded-[12px]">
            Deploy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
