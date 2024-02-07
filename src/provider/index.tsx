'use client';

import StoreProvider from './store';
import { ConfigProvider, message } from 'antd';

import enUS from 'antd/lib/locale/en_US';

import WebLoginProvider from './webLoginProvider';
import { useState } from 'react';
import { store } from 'redux/store';
import Loading from 'components/Loading';

import { fetchConfig } from 'api/request';
import { setElfInfo } from 'redux/reducer/elfInfo';
import { useMount } from 'react-use';
import NiceModal from '@ebay/nice-modal-react';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const storeConfig = async () => {
    const { data } = await fetchConfig();
    store.dispatch(setElfInfo(data));
    setLoading(false);
  };

  useMount(() => {
    storeConfig();
    message.config({
      top: 100,
      duration: 2,
      maxCount: 1,
      prefixCls: 'elf-message',
    });
  });

  return (
    <>
      <StoreProvider>
        <ConfigProvider
          locale={enUS}
          autoInsertSpaceInButton={false}
          prefixCls={'elf'}
          getPopupContainer={(triggerNode) => {
            if (triggerNode) {
              return triggerNode.parentNode as HTMLElement;
            }
            return document.body;
          }}>
          {loading ? (
            <Loading></Loading>
          ) : (
            <WebLoginProvider>
              <NiceModal.Provider>{children}</NiceModal.Provider>
            </WebLoginProvider>
          )}
        </ConfigProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
