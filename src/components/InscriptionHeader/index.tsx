import InscriptionLogo from 'assets/inscription/inscription-logo.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useJumpForest } from 'hooks/useJumpForest';
import Link from 'next/link';
import DropMenuMy from 'components/Header/dropMenuMy';
import useResponsive from 'hooks/useResponsive';
import mobileLogo from 'assets/inscription/mobile-inscription-logo.svg';
import { store } from 'redux/store';

const InscriptionHeader = () => {
  // const { login, logout, isLogin } = useWalletService();
  const Router = useRouter();
  const jumpForest = useJumpForest();
  const info = store.getState().elfInfo.elfInfo;
  const { isLG, isSM } = useResponsive();

  return (
    <div className="py-5 bg-dark-bgc flex items-center justify-between absolute left-4 right-4 pcMin:left-10 pcMin:right-10 z-20 max-w-[1360px] gap-5 sm:gap-6 pc:left-auto pc:right-auto pc:w-full">
      <div>
        <div className="relative w-[75px] h-5 sm:w-[150px] lg:w-[260px] sm:h-[32px] flex items-center cursor-pointer">
          <Image
            className="object-contain"
            onClick={() => {
              Router.push('/');
            }}
            fill
            src={isSM ? mobileLogo : InscriptionLogo}
            alt=""
          />
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6 lg:gap-[80px]">
        <Link
          href="/"
          className="text-sm md:text-base lg:text-lg font-bold text-white hover:text-primary-color-hover active:text-primary-color-active cursor-pointer">
          Tokens
        </Link>
        {info.showMarketplace && (
          <span
            onClick={() => {
              jumpForest('/collections');
            }}
            className="text-sm md:text-base lg:text-lg font-bold text-white hover:text-primary-color-hover active:text-primary-color-active cursor-pointer">
            Marketplace
          </span>
        )}
        <DropMenuMy isMobile={isLG} />
        {/* {isLogin ? (
          <Button
            type="primary"
            className="w-[64px] !text-sm lg:!text-base !flex justify-center items-center !h-8 lg:w-[103px] lg:!h-12"
            onClick={logout}>
            Log out
          </Button>
        ) : (
          <Button
            type="primary"
            className="w-[64px] !text-sm lg:!text-base !flex justify-center items-center !h-8 lg:w-[103px] lg:!h-12"
            onClick={login}>
            Log in
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default InscriptionHeader;
