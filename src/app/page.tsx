// import Home from 'pageComponents/home/home';
// export default Home;
import dynamic from 'next/dynamic';
export default dynamic(() => import('pageComponents/home/home'), { ssr: true });
