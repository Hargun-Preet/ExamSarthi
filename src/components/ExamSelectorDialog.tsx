import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Scale,
  Calculator,
} from "lucide-react";

interface ExamSelectorDialogProps {
  open: boolean;
  onSelect: (exam: string) => void;
}

const exams = [
  { id: "jee", name: "JEE (Engineering)", icon: Calculator },
  { id: "neet", name: "NEET (Medical)", icon: Stethoscope },
  { id: "upsc", name: "UPSC (Civil Services)", icon: Scale },
  { id: "cat", name: "CAT (Management)", icon: Briefcase },
  { id: "gate", name: "GATE (Engineering)", icon: GraduationCap },
  { id: "engineering", name: "College Engineering", icon: Calculator },
  { id: "medical", name: "College Medical", icon: Stethoscope },
  { id: "law", name: "College Law", icon: Scale },
  { id: "other", name: "Other Exams", icon: BookOpen },
];

const ExamSelectorDialog = ({ open, onSelect }: ExamSelectorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Choose Your Career Path
          </DialogTitle>
          <DialogDescription>
            Select the exam you're preparing for to get personalized study
            assistance
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {exams.map((exam) => {
            const Icon = exam.icon;
            return (
              <Button
                key={exam.id}
                variant="outline"
                className="h-auto py-6 flex flex-col gap-3 hover:bg-primary/10 hover:border-primary transition-colors"
                onClick={() => onSelect(exam.id)}
              >
                <Icon className="w-8 h-8 text-blue-400" />
                <span className="text-black text-sm font-medium text-center">
                  {exam.name}
                </span>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamSelectorDialog;
