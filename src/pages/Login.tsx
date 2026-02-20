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
      icon: <BookOpen className="w-5 h-5 stroke-[1.5]" />,
      color: "from-[#2b8df4] to-[#12cff8]",
    },
    {
      role: "Faculty",
      email: "faculty@university.edu",
      icon: <Users className="w-5 h-5 stroke-[1.5]" />,
      color: "from-[#b241ed] to-[#ef4d9b]",
    },
    {
      role: "Admin",
      email: "admin@university.edu",
      icon: <Shield className="w-5 h-5 stroke-[1.5]" />,
      color: "from-[#fb6d3f] to-[#f63d30]",
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-8 animate-fade-in border border-zinc-100">
        <div className="text-center">
          <div className="w-16 h-16 rounded-[1.5rem] bg-black flex items-center justify-center mx-auto mb-5 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Academic AI</h1>
          <p className="text-sm text-zinc-500 mt-2">Welcome! Please enter your details.</p>
        </div>

        {!isSignUp && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-400 uppercase text-center tracking-widest">
              Demo Login
            </p>
            <div className="grid grid-cols-3 gap-3">
              {demoLogins.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleDemoLogin(demo.email)}
                  disabled={isLoading}
                  className={`pt-5 pb-4 px-2 rounded-[1.25rem] bg-gradient-to-b ${demo.color} hover:shadow-lg transition-all disabled:opacity-50 text-white flex flex-col items-center gap-3`}
                >
                  <div className="bg-white/20 p-2.5 rounded-[14px] shadow-sm">{demo.icon}</div>
                  <p className="text-[11px] font-bold tracking-wide">{demo.role}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-100" />
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">or</p>
          <div className="flex-1 h-px bg-zinc-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-2 px-4 py-3.5 rounded-2xl bg-zinc-50/50 border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="Alex Chen"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3.5 rounded-2xl bg-zinc-50/50 border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              placeholder="you@university.edu"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full mt-2 px-4 py-3.5 rounded-2xl bg-zinc-50/50 border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-black text-white font-bold text-sm tracking-wide disabled:opacity-50 hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
          >
            {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 font-medium">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-black font-bold hover:underline underline-offset-4">
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
