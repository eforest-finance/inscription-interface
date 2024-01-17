import AElf from 'aelf-sdk';
const { transform } = AElf.utils;

export const encodedParams = (inputType: any, params: any) => {
  let input = transform.transformMapToArray(inputType, params);
  input = transform.transform(inputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);
  const message = inputType.create(input);
  return inputType.encode(message).finish();
};
