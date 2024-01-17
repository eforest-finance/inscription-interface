import { Input, InputProps, InputRef } from 'antd';
import styles from './styles.module.css';
import { Ref, forwardRef } from 'react';
import { ReactComponent as ClockCircleOutlined } from 'assets/inscription/search.svg';
import { ReactComponent as Clear } from 'assets/inscription/close.svg';

function CollectionSearch(params: InputProps & React.RefAttributes<InputRef>, ref: Ref<InputRef> | undefined) {
  return (
    <div className={styles.search}>
      <Input
        {...params}
        placeholder="Search for an inscription name"
        ref={ref}
        prefix={<ClockCircleOutlined />}
        allowClear={{ clearIcon: <Clear /> }}
      />
    </div>
  );
}

export default forwardRef(CollectionSearch);
