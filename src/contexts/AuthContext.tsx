import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "student" | "faculty" | "admin";

interface DummyUser {
  id: string;
  email: string;
  user_metadata?: { full_name: string };
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface AuthContextType {
  user: DummyUser | null;
  session: { user: DummyUser } | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Dummy role assignment based on email
const getRoleForEmail = (email: string): UserRole => {
  if (email.includes("admin")) return "admin";
  if (email.includes("faculty") || email.includes("prof")) return "faculty";
  return "student";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DummyUser | null>(null);
  const [session, setSession] = useState<{ user: DummyUser } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("dummyUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setSession({ user: parsedUser });
      
      const userRole = getRoleForEmail(parsedUser.email);
      setRole(userRole);
      
      setProfile({
        id: parsedUser.id,
        full_name: parsedUser.user_metadata?.full_name || parsedUser.email.split("@")[0],
        email: parsedUser.email,
        avatar_url: null,
      });
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Dummy sign up - just create a user object
    const dummyUser: DummyUser = {
      id: `user_${Date.now()}`,
      email,
      user_metadata: { full_name: fullName },
    };

    const userRole = getRoleForEmail(email);
    setUser(dummyUser);
    setSession({ user: dummyUser });
    setRole(userRole);
    setProfile({
      id: dummyUser.id,
      full_name: fullName,
      email,
      avatar_url: null,
    });

    // Save to localStorage
    localStorage.setItem("dummyUser", JSON.stringify(dummyUser));

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Dummy sign in - accept any credentials
    const dummyUser: DummyUser = {
      id: `user_${Date.now()}`,
      email,
      user_metadata: { full_name: email.split("@")[0] },
    };

    const userRole = getRoleForEmail(email);
    setUser(dummyUser);
    setSession({ user: dummyUser });
    setRole(userRole);
    setProfile({
      id: dummyUser.id,
      full_name: email.split("@")[0],
      email,
      avatar_url: null,
    });

    // Save to localStorage
    localStorage.setItem("dummyUser", JSON.stringify(dummyUser));

    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    localStorage.removeItem("dummyUser");
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, role, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
