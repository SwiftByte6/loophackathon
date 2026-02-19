import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import {
  BookOpen,
  Brain,
  TrendingUp,
  AlertTriangle,
  Users,
  BarChart3,
  Shield,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Navigate } from "react-router-dom";

export default function HomePage() {
  const { user, role, profile } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {role === "student" && "Here's your academic snapshot"}
            {role === "faculty" && "Manage your courses and students"}
            {role === "admin" && "System administration and analytics"}
          </p>
        </div>

        {/* Student View */}
        {role === "student" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Active Courses"
                value={6}
                icon={<BookOpen className="w-4 h-4" />}
                variant="primary"
              />
              <StatCard
                title="Avg Mastery"
                value="68%"
                icon={<Brain className="w-4 h-4" />}
                variant="accent"
                trend={{ value: 5.2, label: "this week" }}
              />
              <StatCard
                title="Weak Concepts"
                value={3}
                subtitle="Need attention"
                icon={<AlertTriangle className="w-4 h-4" />}
              />
              <StatCard
                title="Study Streak"
                value="12 days"
                icon={<TrendingUp className="w-4 h-4" />}
              />
            </div>

            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/student/courses"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <BookOpen className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">View Courses</p>
                  <p className="text-xs text-muted-foreground">
                    Access your enrolled courses
                  </p>
                </a>
                <a
                  href="/student/ai"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Brain className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">AI Agent</p>
                  <p className="text-xs text-muted-foreground">
                    Get personalized learning help
                  </p>
                </a>
                <a
                  href="/student/progress"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <TrendingUp className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Progress</p>
                  <p className="text-xs text-muted-foreground">
                    Track your learning journey
                  </p>
                </a>
              </div>
            </div>
          </>
        )}

        {/* Faculty View */}
        {role === "faculty" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Courses Teaching"
                value={5}
                icon={<BookOpen className="w-4 h-4" />}
                variant="primary"
              />
              <StatCard
                title="Total Students"
                value={247}
                icon={<Users className="w-4 h-4" />}
                variant="accent"
              />
              <StatCard
                title="Pending Grading"
                value={12}
                subtitle="assignments"
                icon={<FileText className="w-4 h-4" />}
              />
              <StatCard
                title="Class Avg"
                value="78%"
                icon={<BarChart3 className="w-4 h-4" />}
                trend={{ value: 2.1, label: "this semester" }}
              />
            </div>

            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/faculty/courses"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <BookOpen className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Manage Courses</p>
                  <p className="text-xs text-muted-foreground">
                    Edit course content and materials
                  </p>
                </a>
                <a
                  href="/faculty/insights"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <BarChart3 className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Student Insights</p>
                  <p className="text-xs text-muted-foreground">
                    Analyze student performance
                  </p>
                </a>
                <a
                  href="/faculty/ai-panel"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Brain className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">AI Panel</p>
                  <p className="text-xs text-muted-foreground">
                    AI-powered course recommendations
                  </p>
                </a>
                <a
                  href="/faculty/integrity"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Shield className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Academic Integrity</p>
                  <p className="text-xs text-muted-foreground">
                    Monitor student submissions
                  </p>
                </a>
              </div>
            </div>
          </>
        )}

        {/* Admin View */}
        {role === "admin" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={1248}
                icon={<Users className="w-4 h-4" />}
                variant="primary"
              />
              <StatCard
                title="Active Sessions"
                value={234}
                icon={<Clock className="w-4 h-4" />}
                variant="accent"
              />
              <StatCard
                title="System Health"
                value="99.8%"
                icon={<CheckCircle className="w-4 h-4" />}
              />
              <StatCard
                title="Audit Events"
                value={428}
                subtitle="this week"
                icon={<BarChart3 className="w-4 h-4" />}
              />
            </div>

            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Administration
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/admin/users"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Manage Users</p>
                  <p className="text-xs text-muted-foreground">
                    Create, edit, and monitor accounts
                  </p>
                </a>
                <a
                  href="/admin/audit"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <FileText className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Audit Logs</p>
                  <p className="text-xs text-muted-foreground">
                    Review system activity and changes
                  </p>
                </a>
                <a
                  href="/admin/curriculum"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <BookOpen className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Curriculum</p>
                  <p className="text-xs text-muted-foreground">
                    Manage courses and programs
                  </p>
                </a>
                <a
                  href="/admin/config"
                  className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Shield className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Configuration</p>
                  <p className="text-xs text-muted-foreground">
                    System settings and policies
                  </p>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
