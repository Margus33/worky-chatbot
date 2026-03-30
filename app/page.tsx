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

const TOTAL_DISCOVERIES = Object.keys(TAG_CONFIG).length;

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-[var(--color-teal-dark)] shadow-sm ring-1 ring-[var(--color-teal)]/30 transition-all hover:bg-[var(--color-teal)] hover:text-white shrink-0"
    >
      {copied ? "Copiato! ✓" : "Copia"}
    </button>
  );
}

function AchievementCard({ achievement, discoveryNumber }: { achievement: Achievement; discoveryNumber: number }) {
  return (
    <div className="mt-2 rounded-xl border-2 border-[var(--color-orange)]/40 bg-gradient-to-r from-[var(--color-teal-light)] to-orange-50 p-3 star-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="star-pop flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-orange)] to-yellow-400 text-sm text-white font-bold shadow-md">
            ⭐
          </span>
          <span className="text-sm font-semibold text-[var(--color-heading)]">
            Scoperta {discoveryNumber} — {achievement.emoji} {achievement.label}
          </span>
        </div>
        <CopyButton text={achievement.content} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-heading)] whitespace-pre-wrap">
        {achievement.content}
      </p>
    </div>
  );
}

function SidePanel({
  achievements,
  open,
  onClose,
}: {
  achievements: Achievement[];
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const grouped = new Map<string, Achievement>();
  for (const a of achievements) {
    grouped.set(a.tag, a);
  }
  const unique = Array.from(grouped.values());

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <h2 className="text-base font-semibold text-[var(--color-heading)]">
            ⭐ Le tue scoperte ({unique.length}/{TOTAL_DISCOVERIES})
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-body)] hover:bg-[var(--color-bg)]"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {unique.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-body)]">
              Nessuna scoperta ancora. Continua a chattare con Worky!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {unique.map((a, i) => (
                <div
                  key={a.tag}
                  className="rounded-xl border border-[var(--color-orange)]/30 bg-gradient-to-r from-[var(--color-teal-light)] to-orange-50 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-orange)] to-yellow-400 text-sm text-white font-bold shadow-sm">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-heading)]">
                        {a.emoji} {a.label}
                      </span>
                    </div>
                    <CopyButton text={a.content} />
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-heading)] whitespace-pre-wrap">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {unique.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-4">
            <button
              onClick={() => {
                const text = unique
                  .map((a, i) => `⭐ Scoperta ${i + 1} — ${a.emoji} ${a.label}:\n${a.content}`)
                  .join("\n\n---\n\n");
                navigator.clipboard.writeText(text);
              }}
              className="w-full rounded-xl bg-[var(--color-teal)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
            >
              Copia tutte le scoperte
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function MessageContent({ content, discoveryOffset }: { content: string; discoveryOffset: number }) {
  const { cleaned, achievements } = parseAchievements(content);

  return (
    <>
      {cleaned && <span>{cleaned}</span>}
      {achievements.map((a, i) => (
        <AchievementCard key={`${a.tag}-${i}`} achievement={a} discoveryNumber={discoveryOffset + i + 1} />
      ))}
    </>
  );
}

const WELCOME_MESSAGES = [
  {
    id: "welcome",
    role: "assistant" as const,
    content: WELCOME_MESSAGE,
  },
];

export default function Chat() {
  const [mounted, setMounted] = useState(false);
  const [savedMessages, setSavedMessages] = useState<typeof WELCOME_MESSAGES | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("worky-messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedMessages(parsed);
        }
      }
    } catch {}
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-teal)] text-lg font-bold text-white">
            W
          </div>
          <p className="text-sm text-[var(--color-body)]">Caricamento...</p>
        </div>
      </div>
    );
  }

  return <ChatInner initialMessages={savedMessages || WELCOME_MESSAGES} />;
}

function ChatInner({ initialMessages }: { initialMessages: Array<{ id: string; role: "assistant" | "user"; content: string }> }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } =
    useChat({
      initialMessages,
    });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const prevCountRef = useRef(0);
  const [pulseCounter, setPulseCounter] = useState(false);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("worky-messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleReset = useCallback(() => {
    localStorage.removeItem("worky-messages");
    setMessages(WELCOME_MESSAGES);
    setPanelOpen(false);
    prevCountRef.current = 0;
  }, [setMessages]);

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

  // Collect all achievements and track discovery numbers
  const allAchievements: Achievement[] = [];
  const discoveryOffsets: Map<string, number> = new Map();

  for (const m of messages) {
    if (m.role === "assistant") {
      const offset = allAchievements.length;
      const { achievements } = parseAchievements(m.content);
      discoveryOffsets.set(m.id, offset);
      allAchievements.push(...achievements);
    }
  }

  const uniqueMap = new Map<string, Achievement>();
  for (const a of allAchievements) {
    uniqueMap.set(a.tag, a);
  }
  const uniqueCount = uniqueMap.size;

  // Pulse animation when new discovery arrives
  useEffect(() => {
    if (uniqueCount > prevCountRef.current) {
      setPulseCounter(true);
      const timer = setTimeout(() => setPulseCounter(false), 500);
      prevCountRef.current = uniqueCount;
      return () => clearTimeout(timer);
    }
  }, [uniqueCount]);

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
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              onClick={handleReset}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--color-body)] ring-1 ring-[var(--color-border)] transition-colors hover:bg-red-50 hover:text-red-600 hover:ring-red-200"
            >
              Ricomincia
            </button>
          )}
          <button
            onClick={() => setPanelOpen(true)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              uniqueCount > 0
                ? "bg-gradient-to-r from-orange-50 to-yellow-50 ring-1 ring-[var(--color-orange)]/30 hover:ring-[var(--color-orange)]/60"
                : "bg-[var(--color-bg)] ring-1 ring-[var(--color-border)]"
            } ${pulseCounter ? "counter-pulse" : ""}`}
          >
            <span className="text-sm">⭐</span>
            <span className={`text-xs font-semibold ${uniqueCount > 0 ? "text-[var(--color-orange-dark)]" : "text-[var(--color-body)]"}`}>
              {uniqueCount}/{TOTAL_DISCOVERIES} scoperte
            </span>
          </button>
        </div>
      </header>

      {/* Side Panel */}
      <SidePanel
        achievements={allAchievements}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />

      {/* Messages */}
      <div
        ref={scrollRef}
        className="chat-scroll flex-1 overflow-y-auto px-4 py-4"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m) => {
            const offset = discoveryOffsets.get(m.id) ?? 0;
            return (
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
                    <MessageContent content={m.content} discoveryOffset={offset} />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            );
          })}

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
            id="message-input"
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
