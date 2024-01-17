import queryImg from 'assets/images/color-query.png';
import Image from 'next/image';
import { useModal } from '@ebay/nice-modal-react';
import SearchModal from '../searchModal';

const TopSearchBtn = () => {
  const modal = useModal(SearchModal);

  const onClickHandler = () => {
    modal.show();
  };
  return (
    <div className="relative  w-12 h-12 flex items-center cursor-pointer lg:hidden" onClick={onClickHandler}>
      <Image className="object-contain" fill src={queryImg} alt="" />
    </div>
  );
};

export default TopSearchBtn;
