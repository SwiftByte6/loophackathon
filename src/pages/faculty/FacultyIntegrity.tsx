import { DashboardLayout } from "@/components/DashboardLayout";
import { Shield, AlertTriangle, Eye } from "lucide-react";

const flags = [
  { id: 1, student: "Tom Nguyen", type: "Prompt injection attempt", timestamp: "2025-02-17 14:23", severity: "high", details: "Attempted to extract exam answers via prompt manipulation" },
  { id: 2, student: "Unknown", type: "Answer leakage probe", timestamp: "2025-02-17 11:05", severity: "medium", details: "Repeated requests for graded assignment solutions" },
  { id: 3, student: "Sara Khan", type: "Suspicious pattern", timestamp: "2025-02-16 09:41", severity: "low", details: "Unusual query frequency during exam window" },
];

export default function FacultyIntegrity() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrity Monitor</h1>
          <p className="text-sm text-muted-foreground mt-1">Academic integrity flags and AI usage auditing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <Shield className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">98.2%</p>
            <p className="text-xs text-muted-foreground">Clean Interactions</p>
          </div>
          <div className="glass-card p-5 text-center">
            <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Active Flags</p>
          </div>
          <div className="glass-card p-5 text-center">
            <Eye className="w-6 h-6 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">1,247</p>
            <p className="text-xs text-muted-foreground">AI Interactions Today</p>
          </div>
        </div>

        <div className="space-y-3">
          {flags.map((f) => (
            <div key={f.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${f.severity === "high" ? "bg-destructive" : f.severity === "medium" ? "bg-warning" : "bg-info"}`} />
                  <span className="text-sm font-semibold text-foreground">{f.type}</span>
                </div>
                <span className="text-xs text-muted-foreground">{f.timestamp}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Student: {f.student}</p>
              <p className="text-xs text-secondary-foreground">{f.details}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
