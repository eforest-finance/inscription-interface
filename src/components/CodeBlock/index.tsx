import React from 'react';
import './index.css';
import TextArea from 'antd/es/input/TextArea';

export default function CodeBlock({
  value,
  className,
  rows = 8,
  ...params
}: {
  value: string;
  className?: string;
  rows?: number;
}) {
  let jsonFormatted = value;
  try {
    jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
  } catch (e) {
    /* empty */
  }

  return (
    <TextArea
      rows={rows}
      value={jsonFormatted}
      className={`tx-block-code-like-content ${className}`}
      readOnly
      // eslint-disable-next-line no-inline-styles/no-inline-styles
      style={{ height: 200, resize: 'none' }}
      {...params}
    />
  );
}
