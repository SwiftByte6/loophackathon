import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Users, AlertTriangle, BarChart3, BookOpen, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const engagementData = [
  { course: "CS301", engagement: 78 }, { course: "CS340", engagement: 92 },
  { course: "CS350", engagement: 65 }, { course: "CS370", engagement: 54 },
];

const atRiskStudents = [
  { name: "Maria Lopez", course: "CS370", mastery: 38, issue: "Prerequisite gaps" },
  { name: "Tom Nguyen", course: "CS380", mastery: 31, issue: "Low engagement" },
  { name: "Sara Khan", course: "CS301", mastery: 44, issue: "Misconceptions" },
];

export default function FacultyDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor student progress and course health</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={247} icon={<Users className="w-4 h-4 text-primary-foreground" />} variant="primary" />
          <StatCard title="At-Risk Students" value={12} icon={<AlertTriangle className="w-4 h-4 text-accent-foreground" />} variant="accent" />
          <StatCard title="Courses" value={4} icon={<BookOpen className="w-4 h-4 text-secondary-foreground" />} />
          <StatCard title="Avg Engagement" value="72%" icon={<BarChart3 className="w-4 h-4 text-secondary-foreground" />} trend={{ value: -3.1, label: "vs last week" }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Course Engagement</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementData}>
                <XAxis dataKey="course" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 11%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px", color: "hsl(220 15% 92%)" }} />
                <Bar dataKey="engagement" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" /> At-Risk Students
            </h3>
            <div className="space-y-3">
              {atRiskStudents.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.course} — {s.issue}</p>
                  </div>
                  <span className="text-xs font-semibold text-destructive">{s.mastery}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
