'use client';
import { Button } from 'antd';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex gap-12 flex-col justify-center items-center">
        <div className="flex flex-col gap-2 text-center">
          <div className="text-2xl leading-[34px] font-bold text-white">Oops! An unexpected error occurred.</div>
          <div className="text-dark-caption text-xl leading-[30px] font-medium">Please try again later.</div>
        </div>

        <Link href="/">
          <Button type="primary" className="w-[121px] !h-10">
            Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
