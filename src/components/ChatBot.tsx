import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, RotateCcw, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { loadChatHistory, clearChatHistory } from "@/lib/chat.functions";

const SESSION_STORAGE_KEY = "mc_chat_session_key";

function getSessionKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!key) {
    key = crypto.randomUUID();
    window.localStorage.setItem(SESSION_STORAGE_KEY, key);
  }
  return key;
}

function dbRowToUIMessage(row: { id: string; role: string; content: string }): UIMessage {
  return {
    id: row.id,
    role: row.role as "user" | "assistant" | "system",
    parts: [{ type: "text", text: row.content }],
  };
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState("");
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadHistoryFn = useServerFn(loadChatHistory);
  const clearHistoryFn = useServerFn(clearChatHistory);

  // Initialize session key on mount
  useEffect(() => {
    setSessionKey(getSessionKey());
  }, []);

  // Load history when session key is available
  useEffect(() => {
    if (!sessionKey) return;
    loadHistoryFn({ data: { sessionKey } })
      .then((res) => {
        setInitialMessages(res.messages.map(dbRowToUIMessage));
      })
      .catch(() => setInitialMessages([]));
  }, [sessionKey, loadHistoryFn]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { sessionKey },
      }),
    [sessionKey],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    id: sessionKey || "pending",
    messages: initialMessages ?? [],
    transport,
  });

  // Sync initial messages once loaded
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  // Autoscroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading || !sessionKey) return;
    sendMessage({ text });
    setInput("");
  };

  const handleClear = async () => {
    if (!sessionKey) return;
    if (!confirm("Clear this conversation?")) return;
    await clearHistoryFn({ data: { sessionKey } });
    setMessages([]);
  };

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-transform hover:scale-110 md:bottom-6 md:right-6 md:h-16 md:w-16"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%)" }}
        >
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background shadow-2xl md:inset-auto md:bottom-6 md:right-6 md:h-[600px] md:w-[400px] md:rounded-2xl md:border md:border-border" style={{ height: "min(100vh, 600px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.85) 100%)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">MC Interactions Assistant</h3>
                <p className="text-xs opacity-90">Study abroad guidance · AI-powered</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                aria-label="Clear conversation"
                className="rounded-full p-2 hover:bg-white/10"
                title="New conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-2 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-secondary/30 p-4">
            {initialMessages === null ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Namaste! How can I help?</p>
                <p className="mt-1 max-w-[260px] text-xs text-muted-foreground">
                  Ask about study abroad destinations, universities, visas, scholarships, or anything else.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {[
                    "MS in USA cost?",
                    "Best universities in UK",
                    "IELTS requirements",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage({ text: q })}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-primary hover:text-primary"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => {
                  const text = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      {isUser ? (
                        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground shadow-sm">
                          {text}
                        </div>
                      ) : (
                        <div className="max-w-[90%] text-sm text-foreground">
                          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-foreground">
                            <ReactMarkdown>{text || "…"}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {status === "submitted" && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border bg-background p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              disabled={isLoading || !sessionKey}
              maxLength={2000}
              className="flex-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !sessionKey}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
