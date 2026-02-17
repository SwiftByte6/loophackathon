import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, ChevronRight } from "lucide-react";

const courses = [
  { id: "cs301", name: "Algorithms & Complexity", code: "CS301", mastery: 72, concepts: 18, risk: false },
  { id: "cs340", name: "Database Systems", code: "CS340", mastery: 91, concepts: 14, risk: false },
  { id: "cs350", name: "Operating Systems", code: "CS350", mastery: 73, concepts: 20, risk: false },
  { id: "cs370", name: "Computer Networks", code: "CS370", mastery: 55, concepts: 16, risk: true },
  { id: "cs380", name: "Machine Learning Fundamentals", code: "CS380", mastery: 44, concepts: 22, risk: true },
  { id: "cs360", name: "Software Engineering", code: "CS360", mastery: 81, concepts: 12, risk: false },
];

export default function StudentCourses() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Track mastery across all enrolled courses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="glass-card p-5 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.code} · {c.concepts} concepts</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.mastery >= 70 ? "gradient-accent" : c.mastery >= 50 ? "gradient-primary" : "bg-destructive"}`}
                    style={{ width: `${c.mastery}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-10 text-right">{c.mastery}%</span>
              </div>
              {c.risk && (
                <p className="text-[10px] text-destructive mt-2 font-medium">⚠ At risk — below mastery threshold</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
