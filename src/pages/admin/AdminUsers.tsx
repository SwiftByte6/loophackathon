import { DashboardLayout } from "@/components/DashboardLayout";
import { Search } from "lucide-react";
import { useState } from "react";

const users = [
  { id: "1", name: "Alex Chen", email: "alex.chen@uni.edu", role: "student", status: "active" },
  { id: "2", name: "Dr. Sarah Mitchell", email: "s.mitchell@uni.edu", role: "faculty", status: "active" },
  { id: "3", name: "Tom Nguyen", email: "t.nguyen@uni.edu", role: "student", status: "suspended" },
  { id: "4", name: "Prof. David Kim", email: "d.kim@uni.edu", role: "faculty", status: "active" },
  { id: "5", name: "James Walker", email: "j.walker@uni.edu", role: "admin", status: "active" },
];

const roleColors: Record<string, string> = {
  student: "bg-info/10 text-info",
  faculty: "bg-primary/10 text-primary",
  admin: "bg-accent/10 text-accent",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>

        <div className="glass-card flex items-center gap-2 px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Email", "Role", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{u.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="p-4"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[u.role]}`}>{u.role}</span></td>
                  <td className="p-4"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${u.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{u.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
