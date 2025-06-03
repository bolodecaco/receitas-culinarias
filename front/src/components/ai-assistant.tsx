"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AIAssistantProps,
  MessageProps,
  MessageRole,
} from "@/types/MessageProps";
import { BotMessageSquare, Loader2, Send, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./chat-messages";
import { Suggestion } from "./sugestion-questions";

export function AIAssistant({ className }: AIAssistantProps) {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: "default",
      role: "assistant" as MessageRole,
      content: "Como posso ajudar você com seu exame?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input;
    if (!messageContent.trim() || isLoading) return;
    try {
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user" as MessageRole,
          content: messageContent,
          timestamp: new Date().toISOString(),
        },
      ]);

      const body = JSON.stringify({
        prompt: messageContent,
      });

      const response = await fetch("http://localhost:5001/api/recipes/ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }).then((res) => res.json());

      const isRecipe = response.id && response.name;
      const content = isRecipe ? (
        <div className="flex flex-col gap-2">
          <p>Clique para ver a receita</p>
          <Link
            href={`/receitas/${response.id}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-fit"
          >
            Ver receita
          </Link>
        </div>
      ) : (
        response
      );

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as MessageRole,
          content,
          timestamp: new Date().toISOString(),
        },
      ]);

      setInput("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = () => {
    setMessages(messages.slice(0, 1));
  };

  const getSuggestions = () => {
    return [
      "Como fazer um pudim de leite?",
      "Qual a receita de bolo de cenoura?",
      "Quais a receita para uma lasanha de frango?",
    ];
  };

  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          size="icon"
          className="h-12 w-12 bg-amber-500 rounded-full shadow-lg hover:cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <BotMessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col w-80 h-96 bg-background border rounded-lg shadow-lg overflow-auto scrollbar-hide",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <BotMessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-sm">Assistente de receitas</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleClearChat}
            title="Limpar conversa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsMinimized(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col p-2">
          <div className="flex flex-col gap-1">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 py-2 px-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">
                  Pesquisando...
                </span>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} className="h-px" />
        </div>
      </ScrollArea>
      {messages.length <= 2 && (
        <div className="px-3 py-2 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().map((suggestion, index) => (
              <Suggestion
                key={index}
                text={suggestion}
                onClick={() => handleSuggestion(suggestion)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta..."
            className="min-h-9 resize-none"
            rows={3}
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
