import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const AIChatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! Our team will get back to you shortly. For immediate assistance, please use our WhatsApp at +880 1853-452264.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg ${
          isOpen ? "hidden" : ""
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px hsl(var(--glow-primary) / 0.4)",
            "0 0 30px hsl(var(--glow-primary) / 0.6)",
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
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[380px] h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden border border-border/50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t.chatbot.title}</h4>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted/50 rounded-full transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isBot
                        ? "bg-muted/50 text-foreground rounded-tl-md"
                        : "bg-primary text-primary-foreground rounded-tr-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
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
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              {t.chatbot.quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-1.5 text-xs font-medium bg-muted/50 hover:bg-muted rounded-full whitespace-nowrap transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-muted/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t.chatbot.placeholder}
                  className="flex-1 bg-muted/50 border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="rounded-full bg-primary text-primary-foreground"
                  disabled={!input.trim()}
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
