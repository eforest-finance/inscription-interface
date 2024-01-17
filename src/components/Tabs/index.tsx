import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './styles.module.css';

export default function TSMTabs(params: TabsProps) {
  return (
    <div className={styles.tabContainer}>
      <Tabs {...params} />
    </div>
  );
}
