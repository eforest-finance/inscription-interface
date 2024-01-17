import { ReactComponent as SeedSvg } from 'assets/images/SeedDetail.svg';
import SeedBadge from 'components/SeedBadge';
import SeedImage from 'components/SeedImage';
import { SEED_STATUS, SEED_TYPE, TOKEN_TYPE } from 'constants/seedDtail';
import { useMemo } from 'react';
import { ReactComponent as TagNFT } from 'assets/images/tag-seed-nft.svg';
import { ReactComponent as TagToken } from 'assets/images/tag-seed-token.svg';

interface ISeedThumbProps {
  seedInfo: ISeedDetailInfo;
}

function SeedThumb({ seedInfo }: ISeedThumbProps) {
  const { seedImage, status, tokenType } = seedInfo || {};

  const showDefault = useMemo(() => {
    if (status === SEED_STATUS.AVAILABLE) {
      return true;
    }
    if (status === SEED_STATUS.NOT_SUPPORT) {
      return !seedImage;
    }
    return !seedImage;
  }, [status, seedImage]);

  const renderTag = () => {
    const IconSvgComp = String(tokenType).toLowerCase() === TOKEN_TYPE.FT ? TagToken : TagNFT;

    return (
      <span className="absolute w-[52px] h-[28px] -top-1 right-6">
        <IconSvgComp></IconSvgComp>
      </span>
    );
  };

  return (
    <div className="w-full max-lg:mx-auto max-w-[438px] max-h-[438px] mb-6 pcMin:mb-[64px] rounded-[6px] relative ">
      {showDefault ? (
        <div className="relative">
          <SeedSvg className="w-full h-full aspect-square" />
          <div className="absolute top-0 right-0 bottom-0 px-2 left-0 flex items-center justify-center">
            <span className="text-white font-bold break-all text-base pcMin:text-[22px]">{seedInfo?.symbol}</span>
          </div>
          <SeedBadge isLargeBadge={true} tokenType={tokenType} />
        </div>
      ) : (
        <SeedImage className="w-full h-full aspect-square" seedInfo={seedInfo} isLargeBadge={true} />
      )}
      {renderTag()}
    </div>
  );
}

export { SeedThumb };
