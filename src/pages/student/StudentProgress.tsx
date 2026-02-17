import { DashboardLayout } from "@/components/DashboardLayout";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const radarData = [
  { concept: "Sorting", mastery: 88 }, { concept: "Graphs", mastery: 42 },
  { concept: "Trees", mastery: 75 }, { concept: "DP", mastery: 55 },
  { concept: "Hashing", mastery: 91 }, { concept: "Recursion", mastery: 67 },
];

const trendData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  mastery: Math.min(100, 35 + i * 5 + Math.floor(Math.random() * 10)),
}));

const misconceptions = [
  { concept: "Big-O of BFS", count: 4, severity: "high" },
  { concept: "Hash collision handling", count: 2, severity: "medium" },
  { concept: "Tail recursion", count: 3, severity: "medium" },
  { concept: "Dijkstra vs. BFS", count: 5, severity: "high" },
];

export default function StudentProgress() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progress Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep dive into your learning trajectory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Concept Mastery Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 14% 18%)" />
                <PolarAngleAxis dataKey="concept" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} />
                <Radar dataKey="mastery" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Mastery Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="week" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 11%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px", color: "hsl(220 15% 92%)" }} />
                <Line type="monotone" dataKey="mastery" stroke="hsl(180 60% 42%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Misconception Detection</h3>
          <div className="space-y-3">
            {misconceptions.map((m) => (
              <div key={m.concept} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.concept}</p>
                  <p className="text-xs text-muted-foreground">Detected {m.count} times</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  m.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                }`}>
                  {m.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
