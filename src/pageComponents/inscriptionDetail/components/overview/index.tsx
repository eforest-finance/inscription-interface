import Copy from 'components/Copy';
import { formatterDate, thousandsNumber } from 'utils/common';
import { UnionDetailType } from '../../hooks/useGetInscriptionDetail';
import { useJumpExplorer } from 'hooks/useJumpExplorer';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useSelector } from 'react-redux';

const ItemWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between leading-[22px] lg:text-base">
      {children}
    </div>
  );
};

const OverView = ({ info }: { info: UnionDetailType }) => {
  const jumpExplorer = useJumpExplorer();
  const elfinfo = useSelector((store: any) => store.elfInfo.elfInfo);

  return (
    <div className="rounded-xl p-6 pt-0 border border-solid border-dark-border-default text-white mb-4">
      <div className="text-xl font-medium leading-[72px]">Overview</div>
      <div className="text-sm flex flex-col gap-6">
        <ItemWrap>
          <span className="text-dark-caption">Inscription Name</span>
          <span>{info?.tick}</span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Inscription ID</span>
          <span>
            <span className="flex items-center">
              <span
                onClick={() => jumpExplorer(`/tx/${info?.issuedTransactionId}`)}
                className="break-all flex-1 text-primary-color hover:text-primary-color-hover active:text-primary-color-active cursor-pointer">
                {info?.issuedTransactionId}
              </span>
              <Copy className="ml-1" value={info?.issuedTransactionId} />
            </span>
          </span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Chain</span>
          <span>{info?.chainId}</span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Total Supply</span>
          <span>{thousandsNumber(info?.totalSupply)}</span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Minted</span>
          <span>{thousandsNumber(info?.mintedAmt)}</span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Limit Per Mint</span>
          <span>{thousandsNumber(info?.limit)}</span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Deployed By</span>
          <span>
            <span className="flex items-center">
              <span
                onClick={() => jumpExplorer(`/address/${addPrefixSuffix(info?.deployer, elfinfo.curChain)}`)}
                className="break-all flex-1 text-primary-color hover:text-primary-color-hover active:text-primary-color-active cursor-pointer">
                {addPrefixSuffix(info?.deployer, elfinfo.curChain)}
              </span>

              <Copy className="ml-1" value={addPrefixSuffix(info?.deployer, elfinfo.curChain)} />
            </span>
          </span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Deployment Time</span>
          <span>{formatterDate(info?.issuedTime)}</span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Holders</span>
          <span>{thousandsNumber(info?.holderCount)}</span>
        </ItemWrap>

        <ItemWrap>
          <span className="text-dark-caption">Total Transactions</span>
          <span>{thousandsNumber(info?.transactionCount)}</span>
        </ItemWrap>
      </div>
    </div>
  );
};

export default OverView;
