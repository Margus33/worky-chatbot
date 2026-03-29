"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

const WELCOME_MESSAGE =
  "Ciao! Sono Worky, il tuo coach di personal branding di Workengo. Come ti chiami?";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content: WELCOME_MESSAGE,
        },
      ],
    });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[var(--color-warm-200)] bg-white/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-warm-500)] text-sm font-bold text-white">
          W
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight text-[var(--color-warm-800)]">
            Worky
          </h1>
          <p className="text-xs text-[var(--color-warm-500)]">
            Coach Personal Branding
          </p>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="chat-scroll flex-1 overflow-y-auto px-4 py-4"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--color-warm-500)]">
                {m.role === "user" ? "Tu" : "Worky"}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "rounded-br-md bg-[var(--color-warm-600)] text-white"
                    : "rounded-bl-md bg-white text-[var(--color-warm-900)] shadow-sm ring-1 ring-[var(--color-warm-200)]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex flex-col items-start">
                <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--color-warm-500)]">
                  Worky
                </span>
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-[var(--color-warm-200)]">
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-warm-500)]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-warm-500)]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-warm-500)]" />
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-600">
          Errore di connessione. Riprova.
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[var(--color-warm-200)] bg-white/80 px-4 py-3 backdrop-blur-sm">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi un messaggio..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[var(--color-warm-200)] bg-[var(--color-warm-50)] px-4 py-2.5 text-[15px] placeholder-[var(--color-warm-500)]/50 outline-none transition-colors focus:border-[var(--color-warm-500)] focus:ring-1 focus:ring-[var(--color-warm-500)]"
            style={{ maxHeight: "120px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-warm-600)] text-white transition-colors hover:bg-[var(--color-warm-700)] disabled:opacity-40 disabled:hover:bg-[var(--color-warm-600)]"
            aria-label="Invia messaggio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-[var(--color-warm-500)]/60">
          Worky di{" "}
          <a
            href="https://workengo.it"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Workengo.it
          </a>{" "}
          &mdash; Prof. Marco Aurelio Cutrufo
        </p>
      </div>
    </div>
  );
}
