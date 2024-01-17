import { forwardRef, Ref } from 'react';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { SupportedELFChainId } from 'types';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useSelector } from 'redux/store';
import { ReactComponent as ARROWLEFTUP } from 'assets/images/arrow-left-up.svg';
import { BaseSelectRef } from 'rc-select';

interface IAutoCompleteAddressProps extends AutoCompleteProps {
  chainId: SupportedELFChainId;
}

const AutoCompleteAddress = forwardRef(
  ({ chainId, children }: IAutoCompleteAddressProps, ref: Ref<BaseSelectRef> | undefined) => {
    const { walletInfo } = useSelector((store) => store.userInfo);

    const renderOptionItem = () => {
      const address = chainId === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;
      if (!address) return [];

      const showAddress = addPrefixSuffix(address, chainId);

      return {
        value: address,
        label: (
          <div className="flex flex-col text-left text-white border border-primary-color">
            <span className="text-xs text-[#796F94]">My Address</span>
            <div className="flex justify-between">
              <span>{showAddress}</span>
              <ARROWLEFTUP />
            </div>
          </div>
        ),
      };
    };

    const options = [renderOptionItem()];
    return (
      <AutoComplete ref={ref} popupClassName="border border-solid border-primary-color rounded-md;" options={options}>
        {children}
      </AutoComplete>
    );
  },
);

export { AutoCompleteAddress };
