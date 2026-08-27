"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  from: "user" | "assistant";
  text: string;
};

export function ChatBubble({
  from,
  children,
}: {
  from: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = from === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <p
        className={
          isUser
            ? "max-w-[75%] rounded-2xl bg-accent px-3.5 py-2 text-sm text-accent-foreground"
            : "max-w-[75%] rounded-2xl bg-muted px-3.5 py-2 text-sm"
        }
      >
        {children}
      </p>
    </div>
  );
}

export function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl bg-muted px-3.5 py-3">
        <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60" />
        <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
        <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function ChatMessages({
  className,
  messages,
  isTyping,
}: {
  className?: string;
  messages: Message[];
  isTyping?: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className={cn("space-y-3 px-4 py-5", className)}>
      {messages.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Send a message to start a conversation.
        </p>
      )}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} from={msg.from}>
          {msg.text}
        </ChatBubble>
      ))}
      {isTyping && <ChatTypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}

export function ChatComposer({
  className,
  innerClassName,
  onSend,
  disabled,
}: {
  className?: string;
  innerClassName?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && onSend) {
      onSend(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("border-t p-3", className)}>
      <div
        className={cn(
          "flex items-center gap-1 rounded-xl border bg-background py-1 pr-1 pl-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          innerClassName
        )}
      >
        <input
          aria-label="Message the assistant"
          placeholder="Message the assistant…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button size="icon-sm" variant="ghost" aria-label="Dictate a message" disabled={disabled}>
          <Mic />
        </Button>
        <Button
          size="icon-sm"
          aria-label="Send message"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}

const STUB_RESPONSE =
  "I am not set up at the moment please reach out to admin to initiate me.";

export function Chat({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      from: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate typing delay then respond
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        from: "assistant",
        text: STUB_RESPONSE,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      <ChatMessages
        className="flex-1 overflow-y-auto"
        messages={messages}
        isTyping={isTyping}
      />
      <ChatComposer onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
