import React, { useEffect, useRef } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !props.mediaStream) return;
    videoRef.current.srcObject = props.mediaStream;
    if (props.onComplete) props.onComplete({ video: videoRef.current, canvas: canvasRef.current });
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const reader = new QR();
    reader.callback = (err, value) => {
      if (err) return;
      if (props.onResult) props.onResult(value.result);
    };
    const id = setInterval(() => {
      if (!canvasRef.current || !videoRef.current) return;
      ctx.drawImage(videoRef.current, 0, 0);
      reader.decode(ctx.getImageData(0, 0, props.width, props.width));
    },props.scanInterval || 300);
    return () => {
      clearInterval(id);
    };
  }, [videoRef.current, canvasRef.current, props.mediaStream]);
  return (
    <div style={{ height: props.height, width: props.width, display: 'inline-block', backgroundColor: '#efefef' }}>
      <video ref={videoRef} autoPlay={true} width={'100%'} height={'100%'} />
      <canvas ref={canvasRef} style={{ display: 'none' }} height={props.height} width={props.width} />
    </div>
  );
}

export default Scanner;
