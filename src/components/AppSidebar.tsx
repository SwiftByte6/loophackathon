import { useAuth, UserRole } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, BookOpen, Bot, BarChart3,
  Users, Shield, FileText, Brain,
  GraduationCap, Eye, Settings, LogOut,
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
  const { profile, role, signOut } = useAuth();
  if (!role) return null;

  const items = navItems[role];
  const displayName = profile?.full_name || profile?.email || "User";
  const initials = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside className="w-[80px] lg:w-[260px] h-full bg-sidebar rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden shrink-0 border border-white/5 transition-all duration-300">
      <div className="p-6 border-b border-white/5 flex items-center justify-center lg:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-black" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-base font-bold text-white tracking-wide">AcademicAI</h1>
            <p className="text-[11px] text-zinc-400 capitalize -mt-0.5">{role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-2 overflow-y-auto no-scrollbar px-3 overflow-x-hidden">
        {items.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === `/${role}`}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-all justify-center lg:justify-start"
            activeClassName="bg-white/10 text-white font-semibold"
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-2xl bg-white/5 justify-center lg:justify-start">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-black shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 hidden lg:block">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-zinc-400 truncate">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm text-zinc-400 hover:bg-white/10 hover:text-red-400 transition-all w-full justify-center lg:justify-start"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden lg:inline">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
