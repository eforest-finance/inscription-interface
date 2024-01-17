import st from './header.module.css';
import Logo from './logo';
import DropMenuMy from './dropMenuMy';
import DropMenuCreate from './dropMenuCreate';
import TopSearchBtn from './topSearch';
import NavSearch from 'components/NavSearch';
import useResponsive from 'hooks/useResponsive';
import { store } from 'redux/store';
import { useJumpInscription } from 'hooks/useJumpInscription';

interface IHeader {
  showHeaderMask: boolean;
  isHomePage: boolean;
}
export default function Header({ showHeaderMask, isHomePage }: IHeader) {
  const { isLG } = useResponsive();
  const info = store.getState().elfInfo.elfInfo;
  const jump = useJumpInscription();

  return (
    <div className={`${st['header-wrap']} ${showHeaderMask && st['header-wrap-mask']}`}>
      <div className="flex items-center gap-6 flex-1">
        <Logo />
        {!isLG && !isHomePage && <NavSearch />}
      </div>
      <div className="flex gap-2 lg:gap-4 items-center">
        {!isHomePage && <TopSearchBtn />}
        {info.showTsmInscription && (
          <div
            className={st.inscription__button}
            onClick={() => {
              jump();
            }}>
            {info.tsmInscriptionText}
          </div>
        )}
        <DropMenuCreate isMobile={isLG} />
        <DropMenuMy isMobile={isLG} />
      </div>
    </div>
  );
}
