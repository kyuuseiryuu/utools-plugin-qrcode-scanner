import React, { useEffect, useState } from 'react';
import QR from 'qrcode-reader';

interface OnCompleteProps {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
}
interface Props {
  height: number;
  width: number;
  mediaStream: MediaStream | undefined | null;
  scanInterval?: number;
  onResult?: (result: string) => void;
  onImage?: (imgUrl: string) => void;
  onComplete?: (videoAndCanvas: OnCompleteProps) => void;
}

function Scanner(props: Props) {
  const [video, setVideo] = useState<HTMLVideoElement|null|undefined>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement|undefined|null>();
  useEffect(() => {
    if (!video || !canvas || !props.mediaStream) return;
    video.srcObject = props.mediaStream;
    if (props.onComplete) props.onComplete({ video, canvas });
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const reader = new QR();
    reader.callback = (err, value) => {
      if (err) return;
      if (props.onResult) props.onResult(value.result);
    };
    const id = setInterval(() => {
      if (!canvas || !video) return;
      ctx.drawImage(video, 0, 0);
      reader.decode(ctx.getImageData(0, 0, props.width, props.width));
    },props.scanInterval || 300);
    return () => {
      clearInterval(id);
    };
  }, [video, canvas, props.mediaStream]);
  return (
    <div style={{ height: props.height, width: props.width, display: 'inline-block', backgroundColor: '#efefef' }}>
      <video ref={e => setVideo(e)} autoPlay={true} width={'100%'} height={'100%'} />
      <canvas ref={e => setCanvas(e)} style={{ display: 'none' }} height={props.height} width={props.width} />
    </div>
  );
}

export default Scanner;
