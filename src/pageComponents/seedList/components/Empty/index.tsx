import { Button } from 'antd';
import { memo } from 'react';

function Empty({ isMobile, clearAll }: { isMobile: boolean; clearAll?: () => void }) {
  return (
    <div className="w-full h-[274px] lg:h-[698px] flex flex-col items-center justify-center">
      <div className="text-base lg:text-2xl lg:leading-[34px] text-dark-caption font-bold">No result found…</div>
      {isMobile && (
        <Button
          className="mt-12 flex h-10 items-center text-sm font-medium justify-center px-6 py-[10px]"
          type="primary"
          onClick={clearAll}>
          Clear All
        </Button>
      )}
    </div>
  );
}

export default memo(Empty);
