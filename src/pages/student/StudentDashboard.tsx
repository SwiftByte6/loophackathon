import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { BookOpen, Brain, TrendingUp, AlertTriangle, Clock, Target } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const masteryData = [
  { subject: "Algorithms", score: 82 },
  { subject: "Data Structures", score: 68 },
  { subject: "Databases", score: 91 },
  { subject: "Networks", score: 55 },
  { subject: "OS", score: 73 },
  { subject: "ML Basics", score: 44 },
];

const trendData = [
  { week: "W1", mastery: 42 }, { week: "W2", mastery: 48 }, { week: "W3", mastery: 55 },
  { week: "W4", mastery: 52 }, { week: "W5", mastery: 61 }, { week: "W6", mastery: 67 },
  { week: "W7", mastery: 72 }, { week: "W8", mastery: 69 },
];

const weakConcepts = [
  { name: "Graph Traversal (BFS/DFS)", course: "Algorithms", mastery: 32 },
  { name: "Backpropagation", course: "ML Basics", mastery: 28 },
  { name: "TCP/IP Stack", course: "Networks", mastery: 41 },
];

const upcomingAssessments = [
  { title: "Algorithms Midterm", course: "CS301", date: "Feb 24", type: "Exam" },
  { title: "DB Design Project", course: "CS340", date: "Feb 28", type: "Project" },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Alex</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's your academic snapshot</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Courses" value={6} icon={<BookOpen className="w-4 h-4 text-primary-foreground" />} variant="primary" />
          <StatCard title="Avg Mastery" value="68%" icon={<Brain className="w-4 h-4 text-accent-foreground" />} variant="accent" trend={{ value: 5.2, label: "this week" }} />
          <StatCard title="Weak Concepts" value={3} subtitle="Need attention" icon={<AlertTriangle className="w-4 h-4 text-secondary-foreground" />} />
          <StatCard title="Study Streak" value="12 days" icon={<TrendingUp className="w-4 h-4 text-secondary-foreground" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-4">Mastery Radar</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={masteryData}>
                <PolarGrid stroke="hsl(220 14% 18%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} />
                <Radar dataKey="score" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-4">Mastery Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <XAxis dataKey="week" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 11%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px", color: "hsl(220 15% 92%)" }} />
                <Area type="monotone" dataKey="mastery" stroke="hsl(180 60% 42%)" fill="hsl(180 60% 42%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Weak Concepts
            </h3>
            <div className="space-y-3">
              {weakConcepts.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.course}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-destructive" style={{ width: `${c.mastery}%` }} />
                    </div>
                    <span className="text-xs text-destructive font-medium w-8 text-right">{c.mastery}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-info" /> Upcoming Assessments
            </h3>
            <div className="space-y-3">
              {upcomingAssessments.map((a) => (
                <div key={a.title} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">{a.date}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{a.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
