"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState, useCallback } from "react";

const WELCOME_MESSAGE =
  "Ciao! Sono Worky, il tuo coach di personal branding di Workengo. Come ti chiami?";

const TAG_CONFIG: Record<string, { label: string; emoji: string }> = {
  MISSION: { label: "Mission", emoji: "🎯" },
  VISION: { label: "Vision", emoji: "🔭" },
  BIO_LINKEDIN: { label: "Bio LinkedIn", emoji: "💼" },
  BIO_INSTAGRAM: { label: "Bio Instagram", emoji: "📱" },
  SBOCCHI: { label: "Sbocchi lavorativi", emoji: "🚀" },
  PREGI: { label: "Pregi", emoji: "💪" },
  AREE_MIGLIORAMENTO: { label: "Aree di miglioramento", emoji: "📈" },
  BLOCCHI: { label: "Cosa mi blocca", emoji: "🔒" },
  MOTIVAZIONI: { label: "Cosa mi motiva", emoji: "⚡" },
  PILLAR: { label: "Pillar tematici", emoji: "📌" },
  CALENDARIO: { label: "Calendario editoriale", emoji: "📅" },
};

interface Achievement {
  tag: string;
  label: string;
  emoji: string;
  content: string;
}

function parseAchievements(text: string): { cleaned: string; achievements: Achievement[] } {
  const achievements: Achievement[] = [];
  let cleaned = text;

  for (const [tag, config] of Object.entries(TAG_CONFIG)) {
    const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, "g");
    let match;
    while ((match = regex.exec(text)) !== null) {
      achievements.push({
        tag,
        label: config.label,
        emoji: config.emoji,
        content: match[1].trim(),
      });
      cleaned = cleaned.replace(match[0], "");
    }
  }

  return { cleaned: cleaned.trim(), achievements };
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(achievement.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [achievement.content]);

  return (
    <div className="mt-2 rounded-xl border-2 border-[var(--color-teal)] bg-[var(--color-teal-light)] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-teal)] text-xs text-white">
            ✓
          </span>
          <span className="text-sm font-semibold text-[var(--color-teal-dark)]">
            {achievement.emoji} {achievement.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-[var(--color-teal-dark)] shadow-sm ring-1 ring-[var(--color-teal)]/30 transition-all hover:bg-[var(--color-teal)] hover:text-white"
        >
          {copied ? "Copiato! ✓" : "Copia"}
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-heading)] whitespace-pre-wrap">
        {achievement.content}
      </p>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const { cleaned, achievements } = parseAchievements(content);

  return (
    <>
      {cleaned && <span>{cleaned}</span>}
      {achievements.map((a, i) => (
        <AchievementCard key={`${a.tag}-${i}`} achievement={a} />
      ))}
    </>
  );
}

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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

  // Collect all achievements from all messages
  const allAchievements: Achievement[] = [];
  for (const m of messages) {
    if (m.role === "assistant") {
      const { achievements } = parseAchievements(m.content);
      allAchievements.push(...achievements);
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-teal)] text-sm font-bold text-white">
            W
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight text-[var(--color-heading)]">
              Worky
            </h1>
            <p className="text-xs text-[var(--color-body)]">
              Coach Personal Branding — Workengo.it
            </p>
          </div>
        </div>
        {allAchievements.length > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-[var(--color-teal-light)] px-3 py-1">
            <span className="text-xs font-semibold text-[var(--color-teal-dark)]">
              {allAchievements.length} risultati
            </span>
          </div>
        )}
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
              <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--color-body)]">
                {m.role === "user" ? "Tu" : "Worky"}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-[var(--color-teal)] text-white whitespace-pre-wrap"
                    : "rounded-bl-md bg-white text-[var(--color-heading)] shadow-sm ring-1 ring-[var(--color-border)]"
                }`}
              >
                {m.role === "assistant" ? (
                  <MessageContent content={m.content} />
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex flex-col items-start">
                <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--color-body)]">
                  Worky
                </span>
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-[var(--color-border)]">
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-teal)]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-teal)]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-teal)]" />
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
      <div className="border-t border-[var(--color-border)] bg-white px-4 py-3">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <textarea
            ref={inputRef}
            name="message"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi un messaggio..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[15px] text-[var(--color-heading)] placeholder-[var(--color-body)]/50 outline-none transition-colors focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)]"
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-orange)] text-white transition-colors hover:bg-[var(--color-orange-dark)] disabled:opacity-40 disabled:hover:bg-[var(--color-orange)]"
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
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-[var(--color-body)]/60">
          Worky di{" "}
          <a
            href="https://workengo.it"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-teal)]"
          >
            Workengo.it
          </a>{" "}
          &mdash; Prof. Marco Aurelio Cutrufo
        </p>
      </div>
    </div>
  );
}
