import { BookOpen, Brain, Building, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ExamSelectorProps {
  onExamSelect: (exam: string) => void;
  selectedExam: string | null;
}

const exams = [
  { id: 'jee', name: 'JEE Main & Advanced', icon: Brain, description: 'Engineering entrance exams' },
  { id: 'neet', name: 'NEET', icon: BookOpen, description: 'Medical entrance exam' },
  { id: 'upsc', name: 'UPSC', icon: Building, description: 'Civil services examination' },
  { id: 'other', name: 'Other Exams', icon: Users, description: 'Regional & college exams' },
];

const ExamSelector = ({ onExamSelect, selectedExam }: ExamSelectorProps) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Choose Your Exam</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Select the exam you're preparing for, and we'll personalize your learning experience
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {exams.map((exam) => {
            const Icon = exam.icon;
            const isSelected = selectedExam === exam.id;
            
            return (
              <Card
                key={exam.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isSelected 
                    ? 'border-primary shadow-glow bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => onExamSelect(exam.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-lg mb-4 ${
                    isSelected ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <h3 className="font-semibold mb-2">{exam.name}</h3>
                  <p className="text-sm text-muted-foreground">{exam.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExamSelector;
