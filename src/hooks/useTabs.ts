import { useCallback, useEffect, useMemo, useState } from 'react';
type DefaultActiveKeyType = string;
interface ITabPane {
  key: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  closeIcon?: React.ReactNode;
}
interface ITabsProps {
  defaultActiveKey?: DefaultActiveKeyType;
  hashMode?: boolean;
  items: ITabPane[];
}
const useTabs = ({ defaultActiveKey, hashMode = false, items }: ITabsProps) => {
  const [activeKey, setActiveKey] = useState<DefaultActiveKeyType>(hashMode ? '' : (defaultActiveKey as string));
  const onChange = useCallback(
    (activeKey: DefaultActiveKeyType) => {
      setActiveKey(activeKey);
      if (hashMode) {
        window.location.hash = activeKey;
      }
    },
    [hashMode],
  );

  useEffect(() => {
    const hash = window.location.hash.split('#')[1]?.split('?')[0] || '';
    setActiveKey(hash);
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.split('#')[1] || '';
      setActiveKey(hash);
    });
  }, []);

  return useMemo(() => {
    return { activeKey, items, onChange };
  }, [activeKey, items, onChange]);
};

export default useTabs;
