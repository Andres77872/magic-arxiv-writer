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
      <div className="chat-timer-item" title="Sending time">
        <strong>Sent:</strong> {format(displayedSendTime)}
      </div>
      <div className="chat-timer-item" title="Processing time">
        <strong>Proc:</strong> {format(displayedProcessTime)}
      </div>
      <div className="chat-timer-item" title="Generating time">
        <strong>Gen:</strong> {format(displayedGeneratingTime)}
      </div>
      <div className="chat-timer-item" title="Total time">
        <strong>Total:</strong> {format(displayedTotalTime)}
      </div>
    </div>
  );
}