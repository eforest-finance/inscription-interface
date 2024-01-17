import { useSelector } from 'react-redux';
import { selectInfo } from '../reducer/info';
import { getMyAddress } from '../reducer/userInfo';
import { getElfInfo } from 'redux/reducer/elfInfo';

const useGetState = () => {
  const infoState = useSelector(selectInfo);
  const elfInfo = useSelector(getElfInfo);

  return {
    isMobile: infoState.isMobile,
    elfInfo,
    itemsFromLocal: infoState.itemsFromLocal,
    selectedSearchTypeObj: infoState.selectedSearchTypeObj || {
      label: 'Token',
      labelForSwitchButton: 'Token',
      key: '0',
    },
  };
};

export const useGetMyAddress = () => {
  const myAddress = useSelector(getMyAddress);
  return {
    myAddress,
  };
};

export default useGetState;
