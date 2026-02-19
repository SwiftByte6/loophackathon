import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({ variant: "destructive", title: "Sign up failed", description: error.message });
      } else {
        toast({ title: "Check your email", description: "We've sent you a verification link to confirm your account." });
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setFullName("");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ variant: "destructive", title: "Sign in failed", description: error.message });
      } else {
        navigate("/");
      }
    }
    setIsLoading(false);
  };

  const demoLogins = [
    {
      role: "Student",
      email: "student@university.edu",
      icon: <BookOpen className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      role: "Faculty",
      email: "faculty@university.edu",
      icon: <Users className="w-4 h-4" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      role: "Admin",
      email: "admin@university.edu",
      icon: <Shield className="w-4 h-4" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleDemoLogin = async (demoEmail: string) => {
    setIsLoading(true);
    const { error } = await signIn(demoEmail, "password");
    if (!error) {
      navigate("/");
    } else {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 glow-primary">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Curriculum Companion</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered Academic Companion</p>
        </div>

        {!isSignUp && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase text-center tracking-wider">
              Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoLogins.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleDemoLogin(demo.email)}
                  disabled={isLoading}
                  className={`p-3 rounded-lg bg-gradient-to-br ${demo.color} hover:shadow-lg transition-all disabled:opacity-50 text-white text-center`}
                >
                  <div className="flex justify-center mb-1">{demo.icon}</div>
                  <p className="text-xs font-semibold">{demo.role}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-border" />
          <p className="text-xs text-muted-foreground">or</p>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Alex Chen"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@university.edu"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm glow-primary disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
