import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Users, Activity, Bot, GraduationCap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const usageData = Array.from({ length: 14 }, (_, i) => ({
  day: `Feb ${i + 1}`,
  interactions: 800 + Math.floor(Math.random() * 600),
  users: 150 + Math.floor(Math.random() * 100),
}));

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">University-wide AI academic platform metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value="1,842" icon={<Users className="w-4 h-4 text-primary-foreground" />} variant="primary" trend={{ value: 12, label: "this month" }} />
          <StatCard title="Active Sessions" value={347} icon={<Activity className="w-4 h-4 text-accent-foreground" />} variant="accent" />
          <StatCard title="AI Interactions" value="24.3K" subtitle="This month" icon={<Bot className="w-4 h-4 text-secondary-foreground" />} />
          <StatCard title="Courses" value={42} icon={<GraduationCap className="w-4 h-4 text-secondary-foreground" />} />
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">AI Usage Trend (14 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usageData}>
              <XAxis dataKey="day" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220 18% 11%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px", color: "hsl(220 15% 92%)" }} />
              <Area type="monotone" dataKey="interactions" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="users" stroke="hsl(180 60% 42%)" fill="hsl(180 60% 42%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
