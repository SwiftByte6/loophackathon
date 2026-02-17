import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Shield, Users } from "lucide-react";

const roles: { role: UserRole; label: string; desc: string; icon: React.ElementType; path: string }[] = [
  { role: "student", label: "Student", desc: "Access courses, AI tutor & track progress", icon: BookOpen, path: "/student" },
  { role: "faculty", label: "Faculty", desc: "Manage courses, review insights & integrity", icon: GraduationCap, path: "/faculty" },
  { role: "admin", label: "Admin", desc: "System overview, users & configuration", icon: Shield, path: "/admin" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole, path: string) => {
    login(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AcademicAI</h1>
          <p className="text-muted-foreground mt-2">AI-Powered Academic Companion</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground text-center uppercase tracking-wider">Select your role to continue</p>
          {roles.map(({ role, label, desc, icon: Icon, path }) => (
            <button
              key={role}
              onClick={() => handleLogin(role, path)}
              className="w-full glass-card p-4 flex items-center gap-4 hover:border-primary/40 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:gradient-primary transition-all">
                <Icon className="w-5 h-5 text-secondary-foreground group-hover:text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          Demo mode — select a role to explore the platform
        </p>
      </div>
    </div>
  );
}
