import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, ChevronRight } from "lucide-react";

const programs = [
  { name: "B.Sc. Computer Science", courses: 24, students: 580 },
  { name: "B.Sc. Data Science", courses: 18, students: 320 },
  { name: "M.Sc. AI & ML", courses: 12, students: 140 },
];

export default function AdminCurriculum() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Curriculum Management</h1>
        <div className="space-y-3">
          {programs.map((p) => (
            <div key={p.name} className="glass-card p-5 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.courses} courses · {p.students} students</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
