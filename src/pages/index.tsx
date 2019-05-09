import React, { useEffect, useState } from 'react';
import styles from './index.css';
import Scanner from '@/components/Scanner';
import { Modal, Card, message, Checkbox } from 'antd';
message.config({ maxCount: 1 });

declare const window: any;

const HEIGHT = 300;
const WIDTH = 300;

const Content = ({ children, ...props }) => {
  if (!children) return null;
  return (
    <Card className={styles.card} hoverable={true} {...props}>
      {children}
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
  const [mediaStream, setMediaStream] = useState<MediaStream|null|undefined>();
  const copy = t => () => {
    window.utils.setText(t);
    message.success('已复制');
  };
  const handleResult = newText => {
    console.log(newText, Date.now());
    setText(newText);
  };
  const handleCheckChange = e => {
    setCopyRightNow(e.target.checked);
  };
  const retry = () => {
    Modal.error({
      content: '摄像头调用失败~',
      okText: '重试',
      onOk: reload,
      cancelText: '先这样...',
    });
  };
  useEffect(() => {
    if (copyRightNow && text) {
      copy(text)();
    }
  }, [text, copyRightNow]);
  useEffect(() => {
    (async () => {
      const m = await getMediaStream().catch(retry);
      if (m) setMediaStream(m);
    })();
  }, []);
  const reload = async () => {
    if (!mediaStream) return;
    mediaStream.getVideoTracks().forEach(m => m.stop());
    const m = await getMediaStream().catch(retry);
    if (m) setMediaStream(m);
  };
  return (
    <div className={styles.normal}>
      <Checkbox checked={copyRightNow} onChange={handleCheckChange}>
        <span style={{ userSelect: 'none' }}>扫描即复制</span>
      </Checkbox>
      &nbsp;<a onClick={reload} style={{ userSelect: 'none' }}>重载摄像头</a>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Scanner
          mediaStream={mediaStream}
          scanInterval={100}
          onResult={handleResult}
          height={HEIGHT}
          width={WIDTH}
        />
      </div>
      <Content onClick={copy(text)}>{text}</Content>
    </div>
  );
}
