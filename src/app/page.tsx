// import Home from 'pageComponents/home/home';
// export default Home;
'use client';
import dynamic from 'next/dynamic';
export default dynamic(() => import('pageComponents/inscriptions'), { ssr: false });
