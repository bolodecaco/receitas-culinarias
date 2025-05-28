export type MessageRole = "assistant" | "user";

export interface MessageProps {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface SuggestionProps {
  text: string;
  onClick: () => void;
}

export interface AIAssistantProps {
  className?: string;
}