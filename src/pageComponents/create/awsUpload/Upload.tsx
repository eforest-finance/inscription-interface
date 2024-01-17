import { useRef, useState } from 'react';
import { Upload as AntUpload, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { ReactComponent as UploadIcon } from 'assets/images/upload-image.svg';
import { ReactComponent as UploadIconWhite } from 'assets/images/upload-icon-white.svg';
import { useHover } from 'ahooks';
import { useAWSUploadService } from 'utils/S3';
import Image from 'next/image';

import styles from './upload.module.css';
import clsx from 'clsx';

const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

interface AWSUploadChangeParam {
  fileUrl: string;
}
interface AWSUploadProps {
  onChange?: (props: AWSUploadChangeParam) => void;
  upLoadingStatus?: (value?: string) => void;
}

export function AWSUpload(props: AWSUploadProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { awsUploadFile } = useAWSUploadService();

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    // console.log('fileLIst', fileList[0]);
    if (!fileList || !fileList.length) return;
    const file = fileList[0];
    setLoading(file.status === 'uploading');

    if (file.status === 'uploading') {
      message.loading('uploading');
    }
    if (file.status === 'done') {
      message.success(`${file.name || ''} file uploaded successfully.`);
      getBase64(file.originFileObj as File, setImageUrl);
      props.onChange && props.onChange({ fileUrl: file.response.url });
    }
    props.upLoadingStatus && props.upLoadingStatus(file.status);
  };

  const beforeUpload = async (file: File) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/svg' ||
      file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/SVG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 100;
    if (!isLt2M) {
      message.error('Image must smaller than 100MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const customUpload = async ({ file, onSuccess, onError }: UploadRequestOption) => {
    try {
      const uploadFile = await awsUploadFile(file as File);
      onSuccess &&
        onSuccess({
          url: uploadFile,
        });
    } catch (error) {
      onError && onError(error as Error);
    }
  };

  const ref = useRef(null);
  const isHovering = useHover(ref);

  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : !imageUrl ? (
        <UploadIcon className="cursor-pointer closeIcon" />
      ) : (
        <div className="w-[94px] h-[94px] relative" ref={ref}>
          <Image src={imageUrl} width={94} height={94} className="object-cover" alt="img" />
          {isHovering && (
            <div className="w-[94px] h-[94px] flex flex-col items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-img-upload-bg">
              <UploadIconWhite className="cursor-pointer" />
              <div className="text-sm font-medium text-white">Edit</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const uploadProps: UploadProps = {
    ...props,
    accept: '.jpeg,.jpg,.png,.svg',
    listType: 'picture-card',
    maxCount: 1,
    showUploadList: false,
    customRequest: customUpload,
    onChange: handleChange,
    beforeUpload,
  };

  return (
    <div className={clsx(styles['img-uploader-wrapper'], imageUrl && styles['elf-upload__hasimg'])}>
      <AntUpload {...uploadProps}>{uploadButton}</AntUpload>
      <div className="flex flex-col pl-[8px]">
        <div className="text-[14px] text-white leading-normal">Fomats supported: JPG, PNG, and SVG.</div>
        <div className='className="text-[14px] text-white leading-normal"'>Max size: 100 MB.</div>
      </div>
    </div>
  );
}
