import { Checkbox, Col, Row } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxItemType, FilterType, ItemsSelectSourceType, SourceItemType } from 'pageComponents/seedList/type';
import { memo, useCallback, useMemo } from 'react';
import styles from './style.module.css';

export interface CheckboxChoiceProps {
  dataSource?: CheckboxItemType;
  defaultValue?: SourceItemType[];
  onChange?: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
}

function CheckBoxGroups({ dataSource, defaultValue, onChange }: CheckboxChoiceProps) {
  const valueChange = useCallback(
    (value: CheckboxValueType[]) => {
      if (!dataSource) return;
      const data = dataSource?.data.filter((item) => {
        return value.some((s) => s === item.value);
      });
      onChange?.({
        [dataSource.key]: {
          type: FilterType.Checkbox,
          data,
        },
      });
    },
    [dataSource, onChange],
  );
  const checkboxItem = useMemo(() => {
    const data = dataSource?.data || [];
    return data.map((item: SourceItemType) => {
      return (
        <Col className="px-6 py-4" key={item.value} span={24}>
          <Checkbox value={item.value}>{item.label}</Checkbox>
        </Col>
      );
    });
  }, [dataSource]);
  const getVal = useMemo(() => {
    return defaultValue?.map((item) => item.value);
  }, [defaultValue]);
  return (
    <>
      <Checkbox.Group value={getVal} className={styles.checkbox} onChange={valueChange}>
        <Row className="bg-dark-bgc">{checkboxItem}</Row>
      </Checkbox.Group>
      {/* {(
        <div className={clsx(styles['clear-all'], 'flex w-full p-4 bg-dark-bgc')}>
          <Button
            className={clsx(
              styles['range-select-apply'],
              styles['range-primary-button'],
              'flex items-center flex-1 px-6 !py-[10px]',
            )}
            disabled={disableClearAll}
            onClick={clearAll}
            icon={<ClearFilterIcon />}>
            <span className="line-block leading-5 ml-4">Clear Filter</span>
          </Button>
        </div>
      )} */}
    </>
  );
}

export default memo(CheckBoxGroups);
