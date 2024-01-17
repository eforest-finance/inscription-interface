import React from 'react';
import { Image } from 'antd';
import defaultImage from '../headInfo/defaultImage';
import useResponsive from 'hooks/useResponsive';

interface IProps {
  avatar?: string;
  name: string;
  subTitle?: string;
  price?: string;
}

function InscriptionInfo(props: IProps) {
  const { avatar, name, subTitle, price } = props;

  const { isMobile } = useResponsive();

  return (
    <div className="flex justify-between items-center">
      <div className={`flex items-center ${isMobile && 'flex-col !items-start'}`}>
        <Image
          src={avatar || defaultImage}
          className="!w-[84px] !h-[84px] !rounded-[8px] border border-solid border-primary-border"
          alt=""
        />
        <span
          className={`text-[20px] leading-[28px] text-[#E8E8E8] font-semibold ml-[16px] ${
            isMobile && '!ml-0 !mt-[4px]'
          }`}>
          {name}
        </span>
      </div>
      <div className="!flex !flex-col !justify-center !items-end">
        <span className="text-[16px] leading-[24px] text-[#796F94] font-medium mb-[4px]">{subTitle}</span>
        <span className="text-[20px] leading-[28px] text-white font-semibold">{price}</span>
      </div>
    </div>
  );
}

export default React.memo(InscriptionInfo);
