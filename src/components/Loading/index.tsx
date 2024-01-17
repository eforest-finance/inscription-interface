'use client';
import Lottie from 'lottie-react';
import loadingAnimation from 'assets/images/lodaing.json';

export default () => (
  <div className="flex justify-center items-center w-full h-full bg-dark-bgc">
    <div className="w-56 px-4 py-5 flex rounded-md bg-dark-modal-bg flex-col items-center h-[120px] justify-center">
      <Lottie animationData={loadingAnimation} className="w-12 h-12 mb-4" />
      <span className="inline-block text-sm text-white">loading...</span>
    </div>
  </div>
);
