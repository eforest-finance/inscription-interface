import { NOT_SUPPORT_SEED_STATUS, SEED_STATUS, SEED_TYPE } from 'constants/seedDtail';
import clsx from 'clsx';

interface SeedStatusProps {
  seedDetailInfo: ISeedDetailInfo;
}

type statusTagType = 'success' | 'error';

type statusClassStrType = {
  [key in statusTagType]: String;
};

const wrapperClassStr: statusClassStrType = {
  success: 'bg-[#08D1892F] border-[#08D1891F]',
  error: 'bg-[#BE283A2F] border-[#BE283A1F]',
};
const textStatusClassStr: statusClassStrType = {
  success: 'text-[#08D189]',
  error: 'text-[#BE283A]',
};

function StatusTag({ title, type }: { title: string; type: statusTagType }) {
  const wrapperClass = wrapperClassStr[type];
  const textClass = textStatusClassStr[type];
  return (
    <div className="mt-6">
      <div className={clsx('inline-flex border border-solid px-6 py-1.5 rounded-full', wrapperClass)}>
        <span className={clsx('text-[14px] font-medium', textClass)}>{title}</span>
      </div>
    </div>
  );
}

function SeedStatus({ seedDetailInfo }: SeedStatusProps) {
  // const { status } = seedDetailInfo || {};

  // const statusTagType = status === SEED_STATUS.NOT_SUPPORT ? 'error' : 'success';

  const { statusTitle, description, statusTagTypeStr } = getStatusTileOrDesc(seedDetailInfo);

  if (!statusTitle) return null;

  return (
    <>
      <StatusTag title={statusTitle} type={statusTagTypeStr as statusTagType}></StatusTag>
      {!description ? null : <div className="text-white text-[14px] mt-6">{description}</div>}
    </>
  );
}

function getStatusTileOrDesc(seedDetailInfo: ISeedDetailInfo) {
  const res = {
    description: '',
    statusTitle: '',
    statusTagTypeStr: 'success',
  };
  const { seedType, status, notSupportSeedStatus, tokenType } = seedDetailInfo || {};

  if (seedType === SEED_TYPE.REGULAR) {
    if (status === SEED_STATUS.AVAILABLE) {
      res.statusTitle = 'Available for registration';
      return res;
    }
  }

  if (seedType === SEED_TYPE.NOTABLE) {
    if (status === SEED_STATUS.AVAILABLE) {
      res.statusTitle = 'Available for Enquiry';
      return res;
    }
  }

  if (seedType === SEED_TYPE.UNIQUE) {
    // for bid available
    if (status === SEED_STATUS.AVAILABLE) {
      res.statusTitle = 'Available for Bid';
      return res;
    }
  }

  if (status === SEED_STATUS.REGISTERED) {
    res.statusTitle = 'Not Supported';
    res.statusTagTypeStr = 'error';
    res.description =
      tokenType === 'FT'
        ? `This symbol has been used for a created token`
        : 'This symbol has been used for a created NFT collection';
    return res;
  }

  if (status === SEED_STATUS.NOT_SUPPORT) {
    res.statusTitle = 'Not Supported';
    res.statusTagTypeStr = 'error';

    const suffixDesc = tokenType !== 'FT' ? 'Token' : 'NFT collection';

    if (notSupportSeedStatus === NOT_SUPPORT_SEED_STATUS.UNREGISTERED || !notSupportSeedStatus) {
      res.description = `This symbol can only be used for ${suffixDesc} creation.`;
    }

    if (notSupportSeedStatus === NOT_SUPPORT_SEED_STATUS.REGISTERED) {
      res.description = `This symbol has been used for a created token`;
    }

    return res;
  }

  return res;
}

export { SeedStatus, getStatusTileOrDesc };
