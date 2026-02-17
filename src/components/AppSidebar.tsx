import { useAuth, UserRole } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, BookOpen, Bot, BarChart3, Settings,
  Users, Shield, FileText, AlertTriangle, Brain,
  GraduationCap, Upload, Eye, Activity, LogOut,
} from "lucide-react";

const navItems: Record<UserRole, { title: string; url: string; icon: React.ElementType }[]> = {
  student: [
    { title: "Dashboard", url: "/student", icon: LayoutDashboard },
    { title: "Courses", url: "/student/courses", icon: BookOpen },
    { title: "AI Agent", url: "/student/ai", icon: Bot },
    { title: "Progress", url: "/student/progress", icon: BarChart3 },
  ],
  faculty: [
    { title: "Dashboard", url: "/faculty", icon: LayoutDashboard },
    { title: "Courses", url: "/faculty/courses", icon: BookOpen },
    { title: "Student Insights", url: "/faculty/insights", icon: Eye },
    { title: "Integrity", url: "/faculty/integrity", icon: Shield },
    { title: "AI Explainer", url: "/faculty/ai-panel", icon: Brain },
  ],
  admin: [
    { title: "Overview", url: "/admin", icon: LayoutDashboard },
    { title: "Curriculum", url: "/admin/curriculum", icon: GraduationCap },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Audit Logs", url: "/admin/audit", icon: FileText },
    { title: "Config", url: "/admin/config", icon: Settings },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const items = navItems[user.role];

  return (
    <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-accent-foreground">AcademicAI</h1>
            <p className="text-[10px] text-sidebar-foreground capitalize">{user.role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === `/${user.role}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-primary font-medium"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
