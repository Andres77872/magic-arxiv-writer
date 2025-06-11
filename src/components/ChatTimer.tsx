interface ChatTimerProps {
  sendTime: number;
  processTime: number;
  totalTime: number;
}

export function ChatTimer({ sendTime, processTime, totalTime }: ChatTimerProps) {
  const format = (time: number) => `${(time / 1000).toFixed(2)}s`;
  return (
    <div className="chat-timer">
      <span className="chat-timer-item">1. Sending: {format(sendTime)}</span>
      <span className="chat-timer-item">2. Processing: {format(processTime)}</span>
      <span className="chat-timer-item">3. Total: {format(totalTime)}</span>
    </div>
  );
}