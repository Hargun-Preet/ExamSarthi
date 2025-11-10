import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import ExamSelector from "@/components/ExamSelector";
import Features from "@/components/Features";
import ChatInterface from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setLoading(false);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      setShowChat(true);
    } else {
      navigate("/auth");
    }
  };

  const handleExamSelect = (exam: string) => {
    setSelectedExam(exam);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (showChat && user) {
    return <ChatInterface selectedExam={selectedExam} userId={user.id} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero onGetStarted={handleGetStarted} />
      {/* <ExamSelector
        onExamSelect={handleExamSelect}
        selectedExam={selectedExam}
      />
      <Features /> */}
    </div>
  );
};

export default Index;
