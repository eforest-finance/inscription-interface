import { IFilterSelect } from 'pageComponents/seedList/utils';
import { memo, useCallback, useMemo } from 'react';
import { FilterKeyEnum, FilterType, ItemsSelectSourceType, SourceItemType } from 'pageComponents/seedList/type';
import styles from './style.module.css';
import { ReactComponent as CloseBtn } from 'assets/images/close.svg';
import clsx from 'clsx';
type TagItemType = {
  label: string;
  type: string;
  value?: string | number;
};
function FilterTags({
  filterSelect,
  onchange,
  clearAll,
  className,
}: {
  isMobile?: boolean;
  filterSelect: IFilterSelect;
  onchange?: (result: ItemsSelectSourceType) => void;
  clearAll?: () => void;
  className?: string;
}) {
  const tagList = useMemo(() => {
    const result: TagItemType[] = [];
    for (const [key, value] of Object.entries(filterSelect)) {
      const { data, type } = value;
      if (type === FilterType.Checkbox) {
        data.forEach((element: SourceItemType) => {
          result.push({
            type: key,
            ...element,
          });
        });
      } else if (type === FilterType.Range) {
        const { min, max } = data[0];
        if (min || max) {
          const label = min && max ? `${min}-${max}` : (min === 0 || min) && !max ? `≥${min}` : `≤${max}`;
          result.push({
            type: key,
            label:
              `${key === FilterKeyEnum.Price ? '' : 'Length: '}` +
              label +
              `${key === FilterKeyEnum.Price ? ' ELF' : ''}`,
          });
        }
      }
    }
    return result;
  }, [filterSelect]);
  const closeChange = useCallback(
    (tag: TagItemType) => {
      const filter = filterSelect[tag.type as FilterKeyEnum];
      if (filter.type === FilterType.Checkbox) {
        const data = filter.data as SourceItemType[];
        const result = {
          [tag.type]: {
            ...filter,
            data: data.filter((item) => item.label !== tag.label),
          },
        };
        onchange && onchange(result);
      } else if (filter.type === FilterType.Range) {
        const result = {
          [tag.type]: {
            ...filter,
            data: [{ min: '', max: '' }],
          },
        };
        onchange && onchange(result);
      }
    },
    [filterSelect, onchange],
  );
  const clearAllDom = useMemo(() => {
    return (
      <div
        className={clsx(
          'cursor-pointer text-sm text-primary-color  hover:text-primary-border-hover active:text-primary-border-active ml-3 font-medium',
        )}
        onClick={clearAll}>
        Clear All
      </div>
    );
  }, [clearAll]);
  return tagList.length ? (
    <div className={clsx(styles['filter-tags'], className)}>
      <div className={styles['filter-tags-container']}>
        {tagList.map((tag) => {
          return (
            <div key={tag.label} className={styles['tag-item']}>
              <span className={styles['tag-label']}>{tag.label}</span>
              <CloseBtn
                className="cursor-pointer"
                onClick={() => {
                  closeChange(tag);
                }}
                width={16}
                height={16}
              />
            </div>
          );
        })}
        {clearAllDom}
      </div>
    </div>
  ) : (
    <div></div>
  );
}

export default memo(FilterTags);
