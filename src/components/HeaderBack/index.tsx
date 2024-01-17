import { ReactComponent as BackIcon } from 'assets/inscription/back.svg';
import { useRouter } from 'next/navigation';
export default function HeaderBack({ title = 'Deploy Inscription' }: { title?: string }) {
  const Router = useRouter();
  return (
    <div className="flex items-center">
      <div
        className="flex shrink-0 items-center justify-center w-[48px] h-[48px] bg-primary-color hover:bg-primary-color-hover cursor-pointer active:bg-primary-color-active rounded-full"
        onClick={() => {
          Router.back();
        }}>
        <BackIcon />
      </div>
      <span className="pcMin:text-[40px] text-[30px] leading-[40px] font-semibold text-white pcMin:leading-[48px] ml-4">
        {title}
      </span>
    </div>
  );
}
