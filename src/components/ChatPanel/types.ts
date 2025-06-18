export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface NodeExecution {
  node_id: string;
  node_class: string;
  start_time: number;
  end_time: number;
  execution_time: number;
  status: 'running' | 'completed';
}

export interface ChatMetrics {
  sendTime: number;
  processTime: number;
  generatingTime: number;
  totalTime: number;
  startTime: number;
  isStreaming: boolean;
  nodeExecutions: NodeExecution[];
}

export interface ChatPanelProps {
  markdown: string;
  onUpdateMarkdown: (content: string) => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface ChatTimerProps {
  sendTime: number;
  processTime: number;
  generatingTime: number;
  totalTime: number;
  startTime: number;
  isStreaming: boolean;
}

export interface EmptyStateProps {
  onPromptSelect: (prompt: string) => void;
}

export interface MessageProps {
  message: ChatMessage;
  isGenerating?: boolean;
  metrics?: ChatMetrics;
  nodeExecutions?: NodeExecution[];
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'; 