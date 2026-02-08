import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMessage[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (resp.status === 429) {
      onError("Rate limit exceeded. Please wait a moment and try again.");
      return;
    }
    if (resp.status === 402) {
      onError("Service temporarily unavailable. Please try again later.");
      return;
    }
    if (!resp.ok || !resp.body) {
      onError("Failed to connect to AI service.");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e) {
    console.error("Stream error:", e);
    onError("Connection error. Please try again.");
  }
}

export const AIChatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          text: t.chatbot.greeting,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [t.chatbot.greeting, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const newChatHistory: ChatMessage[] = [...chatHistory, { role: "user", content: userText }];
    setChatHistory(newChatHistory);

    let assistantSoFar = "";
    const botMessageId = (Date.now() + 1).toString();

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === botMessageId);
        if (existing) {
          return prev.map((m) => (m.id === botMessageId ? { ...m, text: assistantSoFar } : m));
        }
        return [
          ...prev,
          {
            id: botMessageId,
            text: assistantSoFar,
            isBot: true,
            timestamp: new Date(),
          },
        ];
      });
    };

    await streamChat({
      messages: newChatHistory,
      onDelta: upsertAssistant,
      onDone: () => {
        setIsTyping(false);
        setChatHistory((prev) => [...prev, { role: "assistant", content: assistantSoFar }]);
      },
      onError: (error) => {
        setIsTyping(false);
        toast({
          title: "Chat Error",
          description: error,
          variant: "destructive",
        });
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            text: "Sorry, I'm having trouble connecting right now. Please try again or contact us via WhatsApp at +880 1853-452264.",
            isBot: true,
            timestamp: new Date(),
          },
        ]);
      },
    });
  }, [input, isTyping, chatHistory]);

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <>
      {/* Floating Button with pulse ring */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg pulse-ring ${
          isOpen ? "hidden" : ""
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px hsl(var(--glow-primary) / 0.4)",
            "0 0 40px hsl(var(--glow-primary) / 0.6)",
            "0 0 20px hsl(var(--glow-primary) / 0.4)",
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[400px] h-[550px] glass-card-glossy rounded-2xl flex flex-col overflow-hidden border border-border/50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-foreground">{t.chatbot.title}</h4>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <p className="text-xs text-muted-foreground">Online • AI Powered</p>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted/50 rounded-full transition-colors hover-glow"
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 90 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index === messages.length - 1 ? 0 : 0.05 }}
                  className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl shadow-lg ${
                      message.isBot
                        ? "bg-muted/60 text-foreground rounded-tl-md backdrop-blur-sm"
                        : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-tr-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {!message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted/60 p-3.5 rounded-2xl rounded-tl-md backdrop-blur-sm">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-border/20">
              {t.chatbot.quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-3.5 py-2 text-xs font-medium glass-card hover:bg-primary/20 rounded-full whitespace-nowrap transition-all hover-glow"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/30 bg-muted/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t.chatbot.placeholder}
                  disabled={isTyping}
                  className="flex-1 bg-muted/40 border border-border/40 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-all disabled:opacity-50"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground h-11 w-11 glow-button"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
