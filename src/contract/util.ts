import { IContractError } from 'types';

export const formatErrorMsg = (result: IContractError) => {
  if (result.message) {
    return {
      ...result,
      error: result.code,
      errorMessage: {
        message: JSON.stringify(result.message),
      },
    };
  } else if (result.Error) {
    return {
      ...result,
      error: '401',
      errorMessage: {
        message: JSON.stringify(result.Error).replace('AElf.Sdk.CSharp.AssertionException: ', ''),
      },
    };
  } else if (typeof result.error !== 'number' && typeof result.error !== 'string') {
    if (result.error?.message) {
      return {
        ...result,
        error: '401',
        errorMessage: {
          message: JSON.stringify(result.error.message).replace('AElf.Sdk.CSharp.AssertionException: ', ''),
        },
      };
    }
  }
  return result;
};
