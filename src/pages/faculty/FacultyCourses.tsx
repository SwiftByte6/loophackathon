import { DashboardLayout } from "@/components/DashboardLayout";
import { Upload, BookOpen, Settings } from "lucide-react";

const courses = [
  { id: "cs301", name: "Algorithms & Complexity", code: "CS301", students: 64, materials: 12, avgMastery: 68 },
  { id: "cs340", name: "Database Systems", code: "CS340", students: 58, materials: 9, avgMastery: 82 },
  { id: "cs350", name: "Operating Systems", code: "CS350", students: 71, materials: 15, avgMastery: 61 },
  { id: "cs370", name: "Computer Networks", code: "CS370", students: 54, materials: 8, avgMastery: 52 },
];

export default function FacultyCourses() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Course Control Center</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage materials, concepts, and AI guardrails</p>
          </div>
        </div>

        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.code} · {c.students} students · {c.materials} materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <p className="text-lg font-bold text-foreground">{c.avgMastery}%</p>
                    <p className="text-[10px] text-muted-foreground">Avg Mastery</p>
                  </div>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <Upload className="w-4 h-4 text-secondary-foreground" />
                  </button>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <Settings className="w-4 h-4 text-secondary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
