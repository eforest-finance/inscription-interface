import Image from 'next/image';
import st from './index.module.css';
import { useRouter } from 'next/navigation';
import useScrollAndJudgeHomePage from 'hooks/useScrollAndJudgeHomePage';
import { ReactComponent as LogoText } from 'assets/images/logo-text.svg';

const logo = '/aelfinscription/images/logo.svg';

interface ILogoDom {
  onClickHandler: () => void;
}
const LogoDom = ({ onClickHandler }: ILogoDom) => {
  return (
    <div className={`${st['logo-container']}`} onClick={onClickHandler}>
      <div className={`${st['logo-wrap']}`}>
        <Image className="object-contain" fill src={logo} alt="" />
      </div>
      <LogoText className={`mb-[3px] hidden xl:inline-block`} />
    </div>
  );
};
const Logo = () => {
  const { isHomePage } = useScrollAndJudgeHomePage();
  const router = useRouter();
  const onClickHandler = () => {
    if (isHomePage) {
      document.body.scrollTo(0, 0);
    } else {
      router.push('/');
    }
  };

  return <LogoDom onClickHandler={onClickHandler} />;
};
// export { LogoDom };
export default Logo;
