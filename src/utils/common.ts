import { SupportedELFChainId } from 'types';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import relativeTime from 'dayjs/plugin/relativeTime';

export const sleep = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const thousandsNumber = (number: string | number): string => {
  const num = Number(number);
  if (number === '' || Number.isNaN(num)) return '-';
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })}`;
};

export const getPageNumber = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};

export const getPage = (skipCount: number | string, pageSize: number) => {
  return new BigNumber(skipCount).div(pageSize).plus(1).toNumber();
};

export const getChainPrefix = (chainId: SupportedELFChainId) => {
  return (chainId === SupportedELFChainId.MAIN_NET ? 'MainChain ' : 'SideChain ') + chainId;
};

// For now, just think about the month
export const getFormatTime = (date: number): string => {
  const month = dayjs(date).diff(dayjs(), 'month');
  return `Expires in ${month} month`;
};

export const expireTimeStr = (expireTime: number) => {
  const diffTime = expireTime - Date.now();
  const minutes = Math.ceil(diffTime / 1000 / 60);
  const hours = Math.ceil(diffTime / 1000 / 60 / 60);
  const days = Math.ceil(diffTime / 1000 / 60 / 60 / 24);
  const months = dayjs(expireTime).diff(dayjs(), 'month');

  let str = '';
  if (diffTime < 0) {
    str = 'has expired';
    return str;
  }
  if (hours <= 1) {
    str = `Expires in ${minutes} minutes`;
    return str;
  }
  if (days <= 1) {
    str = `Expires in ${hours} hours`;
    return str;
  }
  if (months <= 1) {
    str = `Expires in ${days} days`;
    return str;
  }
  return `Expires in ${months} months`;
};

export const getDecimalsSupply = (supply: number, decimals: number) => {
  return new BigNumber(supply).multipliedBy(Math.pow(10, decimals)).toNumber();
};

export const divideDecimalsSupply = (supply: number, decimals: number) => {
  return new BigNumber(supply).dividedBy(Math.pow(10, decimals)).toNumber();
};

export const formatterDate = (date: number | string) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
};

export const dateFromNow = (date: number | string) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};
