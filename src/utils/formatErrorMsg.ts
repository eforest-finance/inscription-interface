export function formatErrorMsg(errorMsg?: string | object, scene = 'buy'): string {
  console.log(errorMsg, 'errorMsg11');
  if (typeof errorMsg === 'object') {
    errorMsg = errorMsg.toString();
  }
  if (!errorMsg) {
    return 'Transaction failed due to an unexpected error. Please try again later.';
  }

  if (/Insufficient balance of ELF/.test(errorMsg)) {
    return 'Transaction failed due to insufficient balance.';
  }

  if (/Insufficient allowance\. Token: ELF/.test(errorMsg)) {
    return 'Insufficient ELF allowance for Symbol Market. Please reset the allowance in the next window.';
  }

  if (/Insufficient balance of SEED/.test(errorMsg)) {
    if (scene === 'buy') {
      return 'SEED has been purchased by another user.';
    } else {
      return 'This SEED has been registered.';
    }
  }

  if (/seed exist/.test(errorMsg.toLowerCase())) {
    return 'This SEED has been registered.';
  }

  return errorMsg;
}
