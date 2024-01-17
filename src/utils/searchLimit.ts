const getSearchLimitNum = (val?: string) => {
  return val === 'Token' ? 10 : 28;
};

export default getSearchLimitNum;
