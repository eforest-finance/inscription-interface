/* eslint-disable no-inline-styles/no-inline-styles */
import { Divider } from 'antd';
import { SEED_STATUS, TOKEN_TYPE_MAP_SHOW } from 'constants/seedDtail';

interface ITokenInfoProps {
  seedDetailInfo: ISeedDetailInfo;
}

function TokenInfo({ seedDetailInfo }: ITokenInfoProps) {
  const { status, tokenType, symbol } = seedDetailInfo || {};
  if (status === SEED_STATUS.NOT_SUPPORT) {
    return null;
  }
  return (
    <div className="mt-6 text-white flex flex-col border-[#231F30] border border-solid rounded-lg">
      <div className="px-[24px] py-[16px] bg-[#0E0C15] text-[16px]">
        <span className="text-[16px] font-medium">Token Info</span>
      </div>
      <Divider style={{ background: '#231F30' }} />
      <div className="p-6 text-[14px] border">
        <div className="flex justify-between">
          <span className="text-[#796F94]">Type</span>
          <span>{TOKEN_TYPE_MAP_SHOW[tokenType as string]}</span>
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-[#796F94]">Token Symbol</span>
          <span>{symbol}</span>
        </div>
      </div>
    </div>
  );
}
export { TokenInfo };
