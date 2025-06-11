import { useState, useEffect } from 'react';

interface ChatTimerProps {
  sendTime: number;
  processTime: number;
  generatingTime: number;
  totalTime: number;
  startTime: number;
  isStreaming: boolean;
}

export function ChatTimer({
  sendTime,
  processTime,
  generatingTime,
  totalTime,
  startTime,
  isStreaming,
}: ChatTimerProps) {
  const [now, setNow] = useState(performance.now());

  useEffect(() => {
    if (!isStreaming) return;
    let frameId: number;
    const update = () => {
      setNow(performance.now());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isStreaming]);

  const elapsed = now - startTime;
  const displayedSendTime =
    sendTime > 0 ? sendTime : Math.max(elapsed, 0);

  let displayedProcessTime = 0;
  if (processTime > 0) {
    displayedProcessTime = processTime;
  } else if (sendTime > 0) {
    displayedProcessTime = Math.max(elapsed - sendTime, 0);
  }

  let displayedGeneratingTime = 0;
  if (generatingTime > 0) {
    displayedGeneratingTime = generatingTime;
  } else if (processTime > 0 && sendTime > 0) {
    displayedGeneratingTime = Math.max(elapsed - sendTime - processTime, 0);
  }

  const displayedTotalTime = isStreaming ? elapsed : totalTime;

  const format = (time: number) => `${(time / 1000).toFixed(2)}s`;

  return (
    <div className="chat-timer">
      <span className="chat-timer-item">1. Sending: {format(displayedSendTime)}</span>
      <span className="chat-timer-item">2. Processing: {format(displayedProcessTime)}</span>
      <span className="chat-timer-item">3. Generating: {format(displayedGeneratingTime)}</span>
      <span className="chat-timer-item">4. Total: {format(displayedTotalTime)}</span>
    </div>
  );
}