import st from './header.module.css';
import Logo from './logo';
import DropMenuMy from './dropMenuMy';
import DropMenuCreate from './dropMenuCreate';
import TopSearchBtn from './topSearch';
import NavSearch from 'components/NavSearch';
import useResponsive from 'hooks/useResponsive';

interface IHeader {
  showHeaderMask: boolean;
  isHomePage: boolean;
}
export default function Header({ showHeaderMask, isHomePage }: IHeader) {
  const { isLG } = useResponsive();

  return (
    <div className={`${st['header-wrap']} ${showHeaderMask && st['header-wrap-mask']}`}>
      <div className="flex items-center gap-6 flex-1">
        <Logo />
        {!isLG && !isHomePage && <NavSearch />}
      </div>
      <div className="flex gap-2 lg:gap-4 items-center">
        {!isHomePage && <TopSearchBtn />}
        <DropMenuCreate isMobile={isLG} />
        <DropMenuMy isMobile={isLG} />
      </div>
    </div>
  );
}
