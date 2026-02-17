import { DashboardLayout } from "@/components/DashboardLayout";
import { Brain, FileText, BarChart3 } from "lucide-react";

const recentExplanations = [
  {
    question: "How does quicksort partition work?",
    answer: "Explained using Lomuto partition scheme with visual step-through",
    documents: ["Lecture 5: Sorting Algorithms", "CLRS Ch.7"],
    confidence: 0.94,
    concepts: ["Quicksort", "Partitioning", "Divide & Conquer"],
  },
  {
    question: "What is normalization in databases?",
    answer: "Covered 1NF through BCNF with examples from student's schema",
    documents: ["Lecture 3: Normalization", "Textbook Ch.12"],
    confidence: 0.89,
    concepts: ["Normalization", "Functional Dependencies", "Normal Forms"],
  },
];

export default function FacultyAIPanel() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Explainable AI Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Understand why the AI gave specific answers</p>
        </div>

        <div className="space-y-4">
          {recentExplanations.map((e, i) => (
            <div key={i} className="glass-card p-5">
              <h3 className="font-semibold text-foreground mb-2">"{e.question}"</h3>
              <p className="text-sm text-secondary-foreground mb-4">{e.answer}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Sources Used
                  </p>
                  {e.documents.map((d) => (
                    <p key={d} className="text-xs text-accent">{d}</p>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Brain className="w-3 h-3" /> Concepts Linked
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {e.concepts.map((c) => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" /> Confidence
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full gradient-accent" style={{ width: `${e.confidence * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{(e.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
