import BaseModal from '../../../components/Modal';
import { Form, Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';
import SearchInput from '../InputSearch/index';
import { useFetchSymbolList } from '../hooks/useFetchSymbolList';
import { useRouter } from 'next/navigation';
import { JumpForestModal } from './JumpForestModal';
import { GetSeedTipsModal } from './GetSeedTipsModal';
import { debounce } from 'lodash-es';
import styles from './style.module.css';

interface ITokenSymbolNameModalProps {
  type: 'FT' | 'NFT';
  title: string;
  subTitle?: string;
}

export const TokenSymbolNameModal = NiceModal.create(({ type, title, subTitle }: ITokenSymbolNameModalProps) => {
  const modal = useModal();
  const jumpModal = useModal(JumpForestModal);
  const getSeedTipsModal = useModal(GetSeedTipsModal);
  const [form] = Form.useForm();
  const [confirmDisable, setConfirmDisable] = useState(true);
  const router = useRouter();

  const { handleFetchSeedList } = useFetchSymbolList();

  const [data, setData] = useState<{
    value: string | ISeedInfo;
    mySeeds: boolean;
  }>({
    value: '',
    mySeeds: false,
  });

  // const onValuesChange = (values: any) => {
  //   console.log('onValuesChange', values);
  //   setConfirmDisable(!values.name);
  // };
  useEffect(() => {
    const symbol: string = typeof data.value === 'string' ? data.value : data.value?.symbol;
    setConfirmDisable(!symbol);
  }, [data]);

  const onConfirm = () => {
    modal.hide();
    const symbol: string = typeof data.value === 'string' ? data.value : data.value?.symbol;
    if (data.mySeeds) {
      if (type === 'NFT') {
        jumpModal.show({
          seedSymbol: symbol,
          seedImage: (data?.value as unknown as ISeedInfo)?.seedImage,
        });
      } else {
        router.push(`/create-ft?seedSymbol=${symbol}`);
      }
    } else {
      getSeedTipsModal.show({
        type,
        symbol,
      });
      // router.push(`/seed-detail?symbol=${symbol}&tokenType=${type}`);
    }
  };

  const footer = (
    <Button
      className={'!h-[52px]'}
      type="primary"
      disabled={confirmDisable}
      onClick={debounce(onConfirm, 1000, { leading: true, trailing: false })}>
      Confirm
    </Button>
  );
  return (
    <BaseModal
      width={680}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      centered
      footer={footer}
      title={title}
      subTitle={subTitle}
      className={styles['token-name-modal']}>
      <Form form={form} layout="vertical" size="large" className="elf-form-vertical-custom">
        <Form.Item name="name" label="Please enter the token symbol you want:">
          <SearchInput type={type} fetchOptions={handleFetchSeedList} placeholder="" onChange={setData}></SearchInput>
        </Form.Item>
      </Form>
    </BaseModal>
  );
});
