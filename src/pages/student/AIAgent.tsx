import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Bot, Send, Sparkles, BookOpen, Brain, FlaskConical, Lightbulb } from "lucide-react";

type Mode = "exam_prep" | "assignment" | "remediation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

const modes: { id: Mode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "exam_prep", label: "Exam Prep", icon: FlaskConical, desc: "Practice & review for exams" },
  { id: "assignment", label: "Assignment Help", icon: BookOpen, desc: "Clarify assignment requirements" },
  { id: "remediation", label: "Remediation", icon: Brain, desc: "Strengthen weak concepts" },
];

const quickActions = ["Explain simpler", "Give an example", "Test me", "Show visual summary"];

const mockResponses: Record<string, { content: string; sources: string[] }> = {
  default: {
    content: "I'm your AI Academic Agent. I can help you understand concepts from your course materials. I'll always reference approved sources and show my reasoning. What would you like to explore?",
    sources: [],
  },
};

export default function AIAgent() {
  const [mode, setMode] = useState<Mode>("exam_prep");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: mockResponses.default.content, sources: [], timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Great question about "${text.trim()}". Let me break this down step by step using your course materials.\n\n**Step 1:** First, let's establish the foundational concept...\n\n**Step 2:** Building on that, we can see that...\n\n**Step 3:** Therefore, the key insight is...\n\nWould you like me to explain any part in more detail, or shall I test your understanding?`,
        sources: ["Lecture 4: Data Structures (CS301)", "Textbook Ch.7 p.142-148"],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Mode selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === m.id ? "gradient-primary text-primary-foreground glow-primary" : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${msg.role === "user" ? "gradient-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3" : "glass-card p-4"}`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">AcademicAI</span>
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Sources</p>
                    {msg.sources.map((s, i) => (
                      <p key={i} className="text-xs text-accent flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {s}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card px-4 py-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary animate-pulse-glow" />
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {quickActions.map((a) => (
            <button key={a} onClick={() => sendMessage(a)} className="px-3 py-1.5 rounded-full text-xs glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              <Lightbulb className="w-3 h-3 inline mr-1" />{a}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="glass-card flex items-center gap-2 p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your course materials..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-3 py-2"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
