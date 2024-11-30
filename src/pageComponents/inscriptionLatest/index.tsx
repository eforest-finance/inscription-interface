import HeaderBack from 'components/HeaderBack';
import useGetLatest from './hooks/useGetLatest';
import Link from 'next/link';
import Image from 'next/image';
import CodeBlock from 'components/CodeBlock';
import { OmittedType, getOmittedStr, addPrefixSuffix } from 'utils/addressFormatting';
import { InscriptionTransferQuery } from 'graphql/types/inscriptionTransfer';
import Button from 'components/Button';
import { useJumpExplorer } from 'hooks/useJumpExplorer';
import { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { dateFromNow, thousandsNumber } from 'utils/common';

import elfIcon from 'components/ELFLogo';

function Card(item: InscriptionTransferQuery) {
  const jumpExplorer = useJumpExplorer();
  const info = useSelector((store: any) => store.elfInfo.elfInfo);

  const onClickHandler = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    jumpExplorer(`/address/${addPrefixSuffix(item?.toAddress, info.curChain)}`);
  };

  return (
    <Link className="w-full" href={`/inscription-detail?tick=${item?.tick}`}>
      <div className="border-solid border-primary-border rounded-xl">
        <div className="relative">
          <Image
            src={item?.inscriptionImage || elfIcon}
            alt=""
            width={400}
            height={400}
            className="w-full h-auto rounded-xl aspect-square object-contain"
          />
          <div className="bg-[#000000C0] absolute top-0 bottom-0 left-0 right-0 rounded-xl flex justify-center">
            <div className="flex w-full justify-center items-center text-white text-base font-medium break-all pl-[80px] pcMin:pl-0">
              <CodeBlock
                className="!bg-transparent cursor-pointer w-full"
                value={JSON.stringify(JSON.parse(item?.inscriptionInfo))}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 flex flex-col">
          <div className="flex justify-between items-center">
            <div className="text-dark-caption truncate">{item?.tick}</div>
            <div className="text-white">{`#${item?.number}`}</div>
          </div>

          <span
            onClick={onClickHandler}
            className="break-all mt-[14px] mb-2 flex-1 text-primary-color hover:text-primary-color-hover active:text-primary-color-active cursor-pointer">
            {getOmittedStr(addPrefixSuffix(item?.toAddress, info.curChain), OmittedType.CUSTOM, {
              prevLen: 8,
              endLen: 11,
              limitLen: 10,
            })}
          </span>

          <div className="text-dark-caption flex justify-between items-end">
            <span>{dateFromNow(item?.blockTime)}</span>
            <span className="bg-dark-progress-divider  rounded-lg p-2 text-sm leading-[22px] text-white">
              X&nbsp;{thousandsNumber(item?.amt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function InscriptionLatest() {
  const { latestArr, run } = useGetLatest();

  return (
    <div className="pt-[80px]">
      <div className="mb-8 flex justify-between">
        <HeaderBack title="Latest AELF Inscriptions" />
        <Button type="primary" ghost onClick={run} className="w-[156px] !h-[48px]">
          refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 pcMin:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pcMin:gap-4 lg:gap-[32px] ">
        {latestArr.map((item) => {
          return <Card key={item.tick} {...item} />;
        })}
      </div>

      {/* <Holders /> */}
    </div>
  );
}

export default InscriptionLatest;
