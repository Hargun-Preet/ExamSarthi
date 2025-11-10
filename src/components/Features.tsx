import { BookText, Calendar, FileText, Upload, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Sparkles,
    title: 'AI Tutor Chat',
    description: 'Get instant answers and explanations from your personal AI tutor available 24/7',
  },
  {
    icon: Upload,
    title: 'Upload Study Material',
    description: 'Upload your own notes, PDFs, and documents for personalized learning',
  },
  {
    icon: Calendar,
    title: 'Custom Study Plans',
    description: 'Receive AI-generated study schedules tailored to your exam date and goals',
  },
  {
    icon: BookText,
    title: 'Smart Flashcards',
    description: 'Auto-generated flashcards from your study material for efficient revision',
  },
  {
    icon: FileText,
    title: 'Practice Tests',
    description: 'Take mock tests and quizzes designed to match your exam pattern',
  },
  {
    icon: Target,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and insights',
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Excel</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and features designed to make your exam preparation effective and efficient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
