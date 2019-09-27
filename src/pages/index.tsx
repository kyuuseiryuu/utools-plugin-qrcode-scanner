import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import styles from './index.css';
import Scanner from '@/components/Scanner';
import { Modal, Card, message, Checkbox } from 'antd';
import copyTextToClipboard from 'copy-text-to-clipboard';
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
  return navigator.mediaDevices.getUserMedia({
    video: { width: WIDTH, height: HEIGHT },
  });
};

export default function() {
  const [text, setText] = useState('');
  const [copyRightNow, setCopyRightNow] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream|null|undefined>();

  const handleCopyClick = useCallback(() => {
    if (!text) return;
    console.log('ready to copy' ,text);
    if (window.setText) {
      window.setText(text);
    } else {
      copyTextToClipboard(text);
    }
    message.success('已复制');
  }, [text]);

  const handleCheckChange = useCallback(e => {
    setCopyRightNow(e.target.checked);
  }, []);

  const loadVideo = useCallback(async () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(m => m.stop());
    }
    setMediaStream(await getMediaStream().catch(retry));
  }, [mediaStream]);

  const retry = useCallback((error) => {
    const modal = Modal.confirm({
      content: '摄像头调用失败~',
      okText: '重试',
      onOk: async () => {
        modal.destroy();
        await loadVideo()
      },
      cancelText: '先这样...',
    });
    throw error;
  }, [loadVideo]);

  useEffect(() => {
    console.log('copy mode or text change', { copyRightNow, text });
    if (copyRightNow && text) {
      console.log('copy right now', text);
      handleCopyClick();
    }
  }, [text, copyRightNow]);

  useLayoutEffect(() => {
    loadVideo().then();
  }, []);

  return (
    <div className={styles.normal}>
      <Checkbox checked={copyRightNow} onChange={handleCheckChange}>
        <span style={{ userSelect: 'none' }}>扫描即复制</span>
      </Checkbox>
      &nbsp;<a onClick={loadVideo} style={{ userSelect: 'none' }}>重载摄像头</a>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Scanner
          mediaStream={mediaStream}
          scanInterval={100}
          onResult={setText}
          height={HEIGHT}
          width={WIDTH}
        />
      </div>
      <Content onClick={handleCopyClick}>{text}</Content>
    </div>
  );
}
