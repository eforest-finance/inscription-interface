import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

const needLoginPaths = ['/create-ft', '/profile'];
const useBackToHomeByRoute = () => {
  const pathname = usePathname();
  const router = useRouter();
  const backToHomeByRoute = useCallback(() => {
    try {
      const firstPathName = '/' + pathname.replace('symbolmarket/', '').split('/')[1];
      if (needLoginPaths.includes(firstPathName)) {
        router.push('/');
      }
    } catch (e) {
      console.log(e);
    }
  }, [pathname, router]);

  return backToHomeByRoute;
};

export default useBackToHomeByRoute;
