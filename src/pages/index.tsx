import React, { useEffect, useState } from 'react';
import styles from './index.css';
import Scanner from '@/components/Scanner';
import { Card, message, Checkbox } from 'antd';

declare const window: any;

const HEIGHT = 300;
const WIDTH = 300;

const Content = ({ children, ...props }) => {
  // if (!children) return null;
  return (
    <Card className={styles.card} hoverable={true} {...props}>
      {children || 'test'.repeat(33)}
    </Card>
  );
};

const getMediaStream = async (): Promise<MediaStream> => {
  return new Promise<MediaStream>((resolve, reject) => {
    navigator.getUserMedia({
      video: { width: WIDTH, height: HEIGHT },
    }, resolve, reject);
  });
};

export default function() {
  const [text, setText] = useState('');
  const [copyRightNow, setCopyRightNow] = useState(true);
  const [media, setMedia] = useState<MediaStream|null|undefined>();
  const copy = () => {
    window.utils.setText(text);
    message.success('已复制');
  };
  const handleCheckChange = e => {
    setCopyRightNow(e.target.checked);
  };
  useEffect(() => {
    (async () => {
      const m = await getMediaStream();
      setMedia(m);
    })();
  }, []);
  useEffect(() => {
    if (copyRightNow && text) {
      message.success('已复制');
      window.utils.setText(text);
    }
  }, [text, copyRightNow]);
  return (
    <div className={styles.normal}>
      <Checkbox checked={copyRightNow} onChange={handleCheckChange}>
        <span style={{ userSelect: 'none' }}>扫描即复制</span>
      </Checkbox>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Scanner
          mediaStream={media}
          scanInterval={100}
          onResult={setText}
          height={HEIGHT}
          width={WIDTH}
        />
      </div>
      <Content onClick={copy}>{text}</Content>
    </div>
  );
}
