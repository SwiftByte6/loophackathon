import { DashboardLayout } from "@/components/DashboardLayout";

const logs = [
  { id: 1, action: "AI Interaction", user: "Alex Chen", role: "student", timestamp: "2025-02-17 15:32", detail: "Asked about quicksort complexity" },
  { id: 2, action: "Integrity Flag", user: "Tom Nguyen", role: "student", timestamp: "2025-02-17 14:23", detail: "Prompt injection attempt detected" },
  { id: 3, action: "Material Upload", user: "Dr. Mitchell", role: "faculty", timestamp: "2025-02-17 12:10", detail: "Uploaded Lecture 6 notes to CS301" },
  { id: 4, action: "Role Change", user: "James Walker", role: "admin", timestamp: "2025-02-17 10:45", detail: "Updated David Kim role to faculty" },
  { id: 5, action: "Policy Update", user: "James Walker", role: "admin", timestamp: "2025-02-16 16:00", detail: "Updated AI guardrail for exam mode" },
];

export default function AdminAudit() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <div className="space-y-2">
          {logs.map((l) => (
            <div key={l.id} className="glass-card p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{l.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">{l.role}</span>
                </div>
                <p className="text-xs text-muted-foreground">{l.user} — {l.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{l.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
