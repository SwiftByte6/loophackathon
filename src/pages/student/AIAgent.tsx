import { useState, useRef, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Bot, Send, BookOpen, Brain, FlaskConical, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Mode = "exam_prep" | "assignment" | "remediation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const modes: { id: Mode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "exam_prep", label: "Exam Prep", icon: FlaskConical, desc: "Practice & review" },
  { id: "assignment", label: "Assignment Help", icon: BookOpen, desc: "Clarify requirements" },
  { id: "remediation", label: "Remediation", icon: Brain, desc: "Strengthen concepts" },
];

const quickActions = ["Explain simpler", "Give an example", "Test me", "Show visual summary"];

const CHAT_URL =
  import.meta.env.VITE_AI_CHAT_URL ||
  "http://localhost:8000/chat";

export default function AIAgent() {
  const [mode, setMode] = useState<Mode>("exam_prep");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hello! I'm your AI Academic Agent. I can help you understand course concepts, prepare for exams, and strengthen your understanding. What would you like to explore?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.content })),
          mode,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "AI service error" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const updateAssistant = (content: string) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id === "streaming") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content } : m);
          }
          return [...prev, { id: "streaming", role: "assistant", content }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              updateAssistant(assistantContent);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Finalize the streaming message with a stable ID
      setMessages(prev => prev.map(m => m.id === "streaming" ? { ...m, id: Date.now().toString() } : m));
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
    } finally {
      setIsLoading(false);
    }
  }, [messages, mode, isLoading, toast]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
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
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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

        <div className="flex gap-2 mb-3 flex-wrap">
          {quickActions.map((a) => (
            <button key={a} onClick={() => sendMessage(a)} disabled={isLoading} className="px-3 py-1.5 rounded-full text-xs glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50">
              <Lightbulb className="w-3 h-3 inline mr-1" />{a}
            </button>
          ))}
        </div>

        <div className="glass-card flex items-center gap-2 p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Ask about your course materials..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-3 py-2"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
