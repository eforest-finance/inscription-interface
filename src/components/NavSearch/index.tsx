import { useCallback, useState } from 'react';
import SearchSelect from 'components/SearchSelect';

interface INavSearchProps {
  autoFocus?: boolean;
  wrapClassName?: string;
  hideSearchInput?: () => void;
  hideModalCb?: () => void;
}
const NavSearch = ({ autoFocus, hideSearchInput, wrapClassName, hideModalCb }: INavSearchProps) => {
  const [redBorder, setRedBorder] = useState(false);

  const inputIsErrorCbHandler = useCallback((inputIsError: boolean) => {
    setRedBorder(inputIsError);
  }, []);

  return (
    <div className={`flex justify-between items-center w-full lg:flex-1 gap-4 relative ${wrapClassName}`}>
      <div
        className={`${
          redBorder
            ? 'border-error-border'
            : 'border-dark-border-default hover:border-primary-color focus-within:border-primary-border-active'
        } rounded-md flex-1 gap-3 border border-solid flex items-center lg:bg-nav-search-bg active:text-primary-border-active`}>
        <SearchSelect
          isSwitchStyle={false}
          autoFocus={autoFocus}
          inputIsErrorCbHandler={inputIsErrorCbHandler}
          hideModalCb={hideModalCb}
        />
      </div>
      <span
        className="text-base cursor-pointer hover:text-primary-border-hover lg:hidden text-white font-medium"
        onClick={() => hideSearchInput && hideSearchInput()}>
        Cancel
      </span>
    </div>
  );
};

export default NavSearch;
