import BadgeToken from 'assets/images/badgeToken.svg';
import BadgeNFT from 'assets/images/badgeNFT.svg';
import { memo } from 'react';
import Image from 'next/image';

const SeedBadge = ({
  isLargeBadge = false,
  tokenType,
}: {
  isLargeBadge?: boolean;
  tokenType: string | number | undefined;
}) => {
  const tokenTypeStr = `${tokenType}`;
  const badge = tokenTypeStr === '0' || tokenTypeStr.toLowerCase() === 'ft' ? BadgeToken : BadgeNFT;
  return (
    <div
      className={`flex items-center justify-center absolute ${
        isLargeBadge ? 'w-[52px] h-[28px] right-6 -top-1' : 'w-[26px] h-[14px] right-1 -top-[1px]'
      }`}>
      <Image className="object-contain" fill src={badge} alt="" />
    </div>
  );
};

export default memo(SeedBadge);
