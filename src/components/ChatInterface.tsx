import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Send,
  Upload,
  BookOpen,
  Calendar,
  FileText,
  X,
  LogOut,
  Youtube,
  Layers,
  Settings,
  Network,
  Volume2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FlashCards from "@/components/FlashCards";
import MindMap from "@/components/MindMap";
import ExamSelectorDialog from "@/components/ExamSelectorDialog";
import LanguageSelector from "@/components/LanguageSelector";
import VoiceInput from "@/components/VoiceInput";

interface ChatInterfaceProps {
  selectedExam: string | null;
  userId: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FlashCardSet {
  id: string;
  title: string;
  cards: any[];
  timestamp: number;
}

interface MindMapNode {
  id: string;
  label: string;
  details: string;
  children: string[];
}

interface MindMapData {
  topic: string;
  nodes: MindMapNode[];
}

const ChatInterface = ({ selectedExam, userId }: ChatInterfaceProps) => {
  const [currentExam, setCurrentExam] = useState<string | null>(selectedExam);
  const [showExamSelector, setShowExamSelector] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [flashCardSets, setFlashCardSets] = useState<FlashCardSet[]>([]);
  const [selectedFlashCardSet, setSelectedFlashCardSet] =
    useState<FlashCardSet | null>(null);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [showMindMap, setShowMindMap] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<string>("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadProfile();
    loadDocuments();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("selected_exam, preferred_language")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferredLanguage(data.preferred_language || "en");
      }

      if (!data?.selected_exam) {
        setShowExamSelector(true);
      } else {
        setCurrentExam(data.selected_exam);
        setMessages([
          {
            role: "assistant",
            content: `Hello! I'm ExamSarthi, your AI study partner for ${data.selected_exam.toUpperCase()}. Upload your study materials and I'll help you understand concepts, create study plans, generate tests, recommend videos, and answer your questions. How can I help you today?`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleExamSelect = async (exam: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ selected_exam: exam })
        .eq("user_id", userId);

      if (error) throw error;

      setCurrentExam(exam);
      setShowExamSelector(false);
      setMessages([
        {
          role: "assistant",
          content: `Hello! I'm ExamSarthi, your AI study partner for ${exam.toUpperCase()}. Upload your study materials and I'll help you understand concepts, create study plans, generate tests, recommend videos, and answer your questions. How can I help you today?`,
        },
      ]);

      toast({
        title: "Career path selected",
        description: `You're now preparing for ${exam.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}-${file.name}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("study-materials")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Process document to extract text
        const { data: processData, error: processError } =
          await supabase.functions.invoke("process-document", {
            body: { fileName, fileType: fileExt },
          });

        if (processError) throw processError;

        // Save metadata to database
        const { error: dbError } = await supabase.from("documents").insert({
          user_id: userId,
          filename: file.name,
          file_path: fileName,
          content: processData.content,
          file_type: fileExt,
        });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "Documents uploaded successfully!",
      });

      loadDocuments();
      setUploadDialogOpen(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          error.message || "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const deleteDocument = async (docId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("study-materials")
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully!",
      });

      loadDocuments();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    if (!messageText) {
      setInput("");
    }
    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          message: textToSend,
          examType: currentExam,
          conversationHistory: messages,
          userId: userId,
          language: preferredLanguage,
        },
      });

      if (error) throw error;

      // Check if response contains flashcards
      const hasFlashcards =
        Array.isArray(data.flashcards) && data.flashcards.length > 0;
      if (hasFlashcards) {
        const newSet: FlashCardSet = {
          id: Date.now().toString(),
          title: `Flashcards - ${new Date().toLocaleString()}`,
          cards: data.flashcards,
          timestamp: Date.now(),
        };
        setFlashCardSets((prev) => {
          const updated = [newSet, ...prev].slice(0, 5);
          return updated;
        });
      }

      if (data.mindmap) {
        setMindMapData(data.mindmap);
      }

      const cleanResponse = (data.response || "")
        .replace(/```flashcards\n[\s\S]*?\n```/g, "")
        .replace(/```mindmap\n[\s\S]*?\n```/g, "")
        .trim();

      const flashcardNote = hasFlashcards
        ? "\n\nI've created flashcards for this query. Use the buttons below to open them."
        : "";

      const finalAssistantContent =
        cleanResponse && cleanResponse.length > 0
          ? `${cleanResponse}${flashcardNote}`
          : hasFlashcards
          ? "I've created flashcards for this query. Use the buttons below to open them."
          : "";

      if (finalAssistantContent) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: finalAssistantContent },
        ]);

        // // Auto-play TTS for assistant responses if enabled
        // if (preferredLanguage !== 'en') {
        //   await playTextToSpeech(finalAssistantContent);
        // }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ preferred_language: language })
        .eq("user_id", userId);

      if (error) throw error;

      setPreferredLanguage(language);
      toast({
        title: "Language Updated",
        description: `Your preferred language has been set to ${language}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // const playTextToSpeech = async (text: string) => {
  //   try {
  //     setIsSpeaking(true);

  //     // Remove markdown formatting for better TTS
  //     const cleanText = text
  //       .replace(/```[\s\S]*?```/g, '')
  //       .replace(/\*\*/g, '')
  //       .replace(/\*/g, '')
  //       .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  //       .replace(/#+\s/g, '')
  //       .trim();

  //     const { data, error } = await supabase.functions.invoke('text-to-speech', {
  //       body: { text: cleanText, voice: 'alloy' },
  //     });

  //     if (error) throw error;

  //     if (data?.audioContent) {
  //       // Convert base64 to audio blob
  //       const binaryString = atob(data.audioContent);
  //       const bytes = new Uint8Array(binaryString.length);
  //       for (let i = 0; i < binaryString.length; i++) {
  //         bytes[i] = binaryString.charCodeAt(i);
  //       }
  //       const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
  //       const audioUrl = URL.createObjectURL(audioBlob);

  //       // Play audio
  //       const audio = new Audio(audioUrl);
  //       audioRef.current = audio;

  //       audio.onended = () => {
  //         setIsSpeaking(false);
  //         URL.revokeObjectURL(audioUrl);
  //       };

  //       await audio.play();
  //     }
  //   } catch (error) {
  //     console.error('TTS Error:', error);
  //     setIsSpeaking(false);
  //   }
  // };

  // const stopSpeaking = () => {
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //     audioRef.current = null;
  //     setIsSpeaking(false);
  //   }
  // };

  // const handleVoiceTranscript = (text: string) => {
  //   setInput(text);
  //   toast({
  //     title: 'Voice Transcribed',
  //     description: 'You can edit before sending',
  //   });
  // };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const quickActions = [
    {
      icon: Calendar,
      label: "Create Study Plan",
      prompt: "Create a personalized study plan for me",
    },
    {
      icon: BookOpen,
      label: "Generate Flashcards",
      prompt: "Generate flashcards on important topics",
    },
    {
      icon: FileText,
      label: "Practice Test",
      prompt: "Create a practice test for me",
    },
    {
      icon: Youtube,
      label: "Video Lectures",
      prompt: "Recommend video lectures on key topics",
    },
    { icon: Network, label: "Mind Map", prompt: "Create a mind map for " },
  ];

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-semibold">ExamSarthi</h1>
              {currentExam && (
                <p className="text-sm text-muted-foreground capitalize">
                  {currentExam}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <LanguageSelector
              currentLanguage={preferredLanguage}
              onLanguageChange={handleLanguageChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExamSelector(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Change Exam
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Materials ({documents.length})
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        // Style code blocks
                        code: ({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: any) =>
                          inline ? (
                            <code
                              className="bg-muted px-1.5 py-0.5 rounded text-sm"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <code
                              className={`${className} block bg-muted p-4 rounded-lg overflow-x-auto`}
                              {...props}
                            >
                              {children}
                            </code>
                          ),
                        // Style links with video thumbnails
                        a: ({ node, children, href, ...props }: any) => {
                          // Check if it's a YouTube link
                          const youtubeMatch = href?.match(
                            /(?:youtube\.com\/watch\?v=|youtube\.com\/results\?search_query=|youtu\.be\/)([^&\s]+)/
                          );
                          if (youtubeMatch) {
                            const isSearch = href.includes("search_query=");
                            if (isSearch) {
                              const query = href.split("search_query=")[1];
                              const thumbnailUrl = `https://img.youtube.com/vi/${
                                query.split("+")[0]
                              }/mqdefault.jpg`;
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-primary hover:underline my-2"
                                  {...props}
                                >
                                  <Youtube className="w-4 h-4" />
                                  {children}
                                </a>
                              );
                            }
                            const videoId = youtubeMatch[1];
                            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block my-4 hover:opacity-80 transition-opacity"
                                {...props}
                              >
                                <div className="border border-border rounded-lg overflow-hidden bg-card">
                                  <img
                                    src={thumbnailUrl}
                                    alt={children as string}
                                    className="w-full"
                                  />
                                  <div className="p-3 flex items-center gap-2">
                                    <Youtube className="w-5 h-5 text-red-500" />
                                    <span className="text-sm font-medium">
                                      {children}
                                    </span>
                                  </div>
                                </div>
                              </a>
                            );
                          }
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="p-4 bg-card">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 py-4 border-t border-border bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 z-10 border-t border-border px-4 py-4 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-4xl mx-auto">
          {/* Flashcard Sets */}
          {flashCardSets.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {flashCardSets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center gap-2 bg-muted rounded-lg p-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFlashCardSet(set);
                      setShowFlashCards(true);
                    }}
                    className="h-auto py-1"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    {set.cards.length} cards
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFlashCardSets((prev) =>
                        prev.filter((s) => s.id !== set.id)
                      );
                      toast({
                        title: "Deleted",
                        description: "Flashcard set deleted",
                      });
                    }}
                    className="h-auto py-1 px-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Mind Map Button */}
          {mindMapData && (
            <div className="mb-3">
              <Button
                variant="outline"
                onClick={() => setShowMindMap(true)}
                className="w-full sm:w-auto"
              >
                <Network className="w-4 h-4 mr-2" />
                View Mind Map
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything about your studies..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Study Materials</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.ppt,.pptx,.xls,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" disabled={uploading} asChild>
                  <span className="cursor-pointer">
                    {uploading ? "Uploading..." : "Choose Files"}
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                Supported: PDF, Images (PNG, JPG, WEBP), Office docs (DOC, DOCX,
                PPT, PPTX, XLS, XLSX), TXT
              </p>
            </div>

            {documents.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Your Documents</h3>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <Card
                      key={doc.id}
                      className="p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteDocument(doc.id, doc.file_path)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Exam Selector Dialog */}
      <ExamSelectorDialog open={showExamSelector} onSelect={handleExamSelect} />

      {/* FlashCards */}
      {showFlashCards && selectedFlashCardSet && (
        <FlashCards
          cards={selectedFlashCardSet.cards}
          onClose={() => {
            setShowFlashCards(false);
            setSelectedFlashCardSet(null);
          }}
        />
      )}

      {/* Mind Map */}
      {showMindMap && mindMapData && (
        <MindMap data={mindMapData} onClose={() => setShowMindMap(false)} />
      )}
    </div>
  );
};

export default ChatInterface;
