import { DashboardLayout } from "@/components/DashboardLayout";
import { Search } from "lucide-react";
import { useState } from "react";

const students = [
  { id: "s1", name: "Alex Chen", mastery: 68, engagement: 85, risk: "low", misconceptions: 2 },
  { id: "s2", name: "Maria Lopez", mastery: 38, engagement: 42, risk: "high", misconceptions: 7 },
  { id: "s3", name: "Tom Nguyen", mastery: 31, engagement: 28, risk: "high", misconceptions: 9 },
  { id: "s4", name: "Sara Khan", mastery: 44, engagement: 55, risk: "medium", misconceptions: 5 },
  { id: "s5", name: "James Park", mastery: 82, engagement: 90, risk: "low", misconceptions: 1 },
  { id: "s6", name: "Priya Sharma", mastery: 76, engagement: 78, risk: "low", misconceptions: 2 },
];

const riskColors: Record<string, string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

export default function FacultyInsights() {
  const [search, setSearch] = useState("");
  const filtered = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Individual mastery and risk analysis</p>
        </div>

        <div className="glass-card flex items-center gap-2 px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Mastery</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Engagement</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Risk</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Misconceptions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="p-4 text-sm font-medium text-foreground">{s.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full gradient-primary" style={{ width: `${s.mastery}%` }} />
                      </div>
                      <span className="text-xs text-foreground">{s.mastery}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{s.engagement}%</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${riskColors[s.risk]}`}>{s.risk}</span>
                  </td>
                  <td className="p-4 text-sm text-foreground">{s.misconceptions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
