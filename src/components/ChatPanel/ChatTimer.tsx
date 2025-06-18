import { useState, useEffect } from 'react';
import { type ChatTimerProps } from './types';
import './ChatTimer.css';

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
      <div className="chat-timer-item" title="Time to establish connection">
        <span className="timer-icon">📡</span>
        <span className="timer-label">Send:</span>
        <span className="timer-value">{format(displayedSendTime)}</span>
      </div>
      <div className="chat-timer-item" title="Server processing time">
        <span className="timer-icon">⚙️</span>
        <span className="timer-label">Proc:</span>
        <span className="timer-value">{format(displayedProcessTime)}</span>
      </div>
      <div className="chat-timer-item" title="Content generation time">
        <span className="timer-icon">✍️</span>
        <span className="timer-label">Gen:</span>
        <span className="timer-value">{format(displayedGeneratingTime)}</span>
      </div>
      <div className="chat-timer-item" title="Total response time">
        <span className="timer-icon">⏱️</span>
        <span className="timer-label">Total:</span>
        <span className="timer-value">{format(displayedTotalTime)}</span>
      </div>
    </div>
  );
} 