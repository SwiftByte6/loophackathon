import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings, Shield, Database, Bot } from "lucide-react";

const configs = [
  { title: "AI Model", desc: "Current: GPT-5 (Abstracted via RAG layer)", icon: Bot, status: "Active" },
  { title: "Guardrails", desc: "Exam answer blocking, prompt injection detection", icon: Shield, status: "Enabled" },
  { title: "Data Retention", desc: "AI interaction logs retained for 365 days", icon: Database, status: "365 days" },
  { title: "Rate Limiting", desc: "50 AI queries per student per hour", icon: Settings, status: "50/hr" },
];

export default function AdminConfig() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">System Configuration</h1>
        <div className="space-y-3">
          {configs.map((c) => (
            <div key={c.title} className="glass-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-success/10 text-success font-medium">{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
