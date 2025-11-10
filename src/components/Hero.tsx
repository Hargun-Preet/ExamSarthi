import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Sparkles,
  ChevronRight,
  MessageCircle,
  BarChart3,
  BookText,
  Calendar,
  FileText,
  Upload,
  Target,
  Brain,
  BookOpen,
  Star,
  Check,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Prop Interface for the Landing Page
// -----------------------------------------------------------------------------
interface LandingPageProps {
  onGetStarted: () => void;
}

// -----------------------------------------------------------------------------
// 1. Navigation Bar
// -----------------------------------------------------------------------------
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        {/* Logo / Brand Name */}
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg">ExamSarthi</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-primary transition-colors">
            Pricing
          </a>
          <a
            href="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            How it works
          </a>
          <a
            href="#testimonials"
            className="hover:text-primary transition-colors"
          >
            Testimonials
          </a>
        </nav>

        {/* Auth Buttons - Linked to /auth */}
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="shadow-lg shadow-primary/30">
              Sign Up
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

// -----------------------------------------------------------------------------
// 2. Hero Section
// -----------------------------------------------------------------------------
// This component now correctly accepts the 'onGetStarted' prop
const Hero = ({ onGetStarted }: LandingPageProps) => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Gradients & Orbs */}
      <div className="absolute inset-0 -z-10 bg-radial-gradient(ellipse at top, var(--tw-gradient-stops)) from-accent/10 to-transparent" />
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-30" />

      <div className="container max-w-7xl py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* --- Left Column (Text & CTA) --- */}
          <div className="text-center lg:text-left">
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Personal AI
              <br />
              <span className="text-primary">Study Partner</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0">
              Master JEE, NEET, UPSC, and all competitive exams with AI-powered
              insights, personalized plans, and 24/7 tutoring.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {[
                { label: "AI Tutoring", value: "24/7" },
                { label: "Exams Supported", value: "All" },
                { label: "Success Rate", value: "95%" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Right Column (Visual Mockup) --- */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-[350px] h-[450px] bg-card/50 backdrop-blur-md rounded-2xl border border-border p-6 shadow-xl">
              {/* Mockup Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold">Your Study Plan</span>
              </div>

              {/* Mockup AI Chat */}
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg rounded-bl-none text-sm">
                  Explain the concept of
                  <br />
                  "Quantum Entanglement".
                </div>
                <div className="p-3 bg-background rounded-lg rounded-br-none text-sm text-muted-foreground flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>
                    Certainly! Quantum entanglement is a phenomenon where...
                  </span>
                </div>
              </div>

              {/* Mockup Progress */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Physics Progress</p>
                <div className="w-full bg-background rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full w-[75%]"></div>
                </div>
                <p className="text-xs text-muted-foreground">75% completed</p>
              </div>

              {/* Floating icon */}
              <div className="absolute -bottom-6 -right-8 p-4 bg-card shadow-lg rounded-full border border-border">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-8 -left-10 p-4 bg-card shadow-lg rounded-full border border-border">
                <BarChart3 className="w-8 h-8 text-primary/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 3. Features Section
// -----------------------------------------------------------------------------
const featuresList = [
  {
    icon: Sparkles,
    title: "AI Tutor Chat",
    description:
      "Get instant answers and explanations from your personal AI tutor available 24/7",
  },
  {
    icon: Upload,
    title: "Upload Study Material",
    description:
      "Upload your own notes, PDFs, and documents for personalized learning",
  },
  {
    icon: Calendar,
    title: "Custom Study Plans",
    description:
      "Receive AI-generated study schedules tailored to your exam date and goals",
  },
  {
    icon: BookText,
    title: "Smart Flashcards",
    description:
      "Auto-generated flashcards from your study material for efficient revision",
  },
  {
    icon: FileText,
    title: "Practice Tests",
    description:
      "Take mock tests and quizzes designed to match your exam pattern",
  },
  {
    icon: Target,
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics and insights",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and features designed to make your exam
            preparation effective and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
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

// -----------------------------------------------------------------------------
// 4. How It Works Section
// -----------------------------------------------------------------------------
const steps = [
  {
    icon: Upload,
    step: "Step 1",
    title: "Upload Your Material",
    description:
      "Simply upload your PDFs, notes, or any study material you have. The more you add, the smarter your AI gets.",
  },
  {
    icon: Brain,
    step: "Step 2",
    title: "AI Analyzes & Plans",
    description:
      "ExamSarthi reads your material and instantly generates a custom study plan, flashcards, and practice quizzes.",
  },
  {
    icon: BookOpen,
    step: "Step 3",
    title: "Start Learning",
    description:
      "Chat with your AI tutor, take tests, and track your progress, all in one place. Master your exam, faster.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From upload to mastery, our process is built for speed and
            efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Dotted line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-border/50 -translate-y-1/2 z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className="bg-card/50 backdrop-blur-sm border-border/50 text-center z-10"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {step.step}
                  </p>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 5. Testimonials Section
// -----------------------------------------------------------------------------
const testimonials = [
  {
    name: "Rohan Sharma",
    title: "JEE Aspirant",
    avatar: "RS",
    quote:
      "ExamSarthi was a game-changer for my JEE prep. The AI tutor's 24/7 availability for doubt-solving is something no coaching center can match. I improved my mock test scores by 40%!",
  },
  {
    name: "Priya Menon",
    title: "NEET Aspirant",
    avatar: "PM",
    quote:
      "I uploaded all my biology notes, and the AI generated flashcards that were perfect for quick revision. It's like having a smart study buddy who knows exactly what you need.",
  },
  {
    name: "Aakash Singh",
    title: "UPSC Aspirant",
    avatar: "AS",
    quote:
      "The custom study plans saved me. Juggling a job and UPSC prep was tough, but ExamSarthi organized all my materials and gave me a clear, achievable schedule.",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trusted by Toppers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what students are saying about their personal AI study partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="flex flex-col justify-between bg-card/50 backdrop-blur-sm border-border/50"
            >
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </CardContent>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={`https://placehold.co/40x40/60a5fa/FFFFFF?text=${testimonial.avatar}`}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">
                    {testimonial.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 6. Pricing Section
// -----------------------------------------------------------------------------
const pricingTiers = [
  {
    plan: "Basic",
    price: "Free",
    description: "Get started with core features.",
    features: [
      "Upload up to 3 documents",
      "Basic AI chat (10 messages/day)",
      "Standard study plans",
    ],
    buttonText: "Start for Free",
    isFeatured: false,
  },
  {
    plan: "Pro",
    price: "₹499",
    pricePeriod: "/ month",
    description: "Unlock your full potential.",
    features: [
      "Unlimited document uploads",
      "Unlimited AI chat",
      "Advanced study plans",
      "Mock tests & quizzes",
      "In-depth progress tracking",
    ],
    buttonText: "Get Started Now",
    isFeatured: true,
  },
  {
    plan: "Enterprise",
    price: "Custom",
    description: "For institutions & coaching centers.",
    features: [
      "All Pro features",
      "Admin dashboard",
      "Student analytics",
      "Custom branding",
      "Dedicated support",
    ],
    buttonText: "Contact Sales",
    isFeatured: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your study goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.plan}
              className={`flex flex-col ${
                tier.isFeatured
                  ? "border-2 border-primary shadow-glow"
                  : "border-border/50"
              }`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl mb-2">{tier.plan}</CardTitle>
                <div className="text-4xl font-bold">
                  {tier.price}
                  {tier.pricePeriod && (
                    <span className="text-lg font-normal text-muted-foreground">
                      {tier.pricePeriod}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/auth" className="w-full">
                  <Button
                    size="lg"
                    className="w-full"
                    variant={tier.isFeatured ? "default" : "outline"}
                  >
                    {tier.buttonText}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 7. Final CTA Section
// -----------------------------------------------------------------------------
const FinalCTA = ({ onGetStarted }: LandingPageProps) => {
  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-4xl mx-auto">
        <div className="relative rounded-2xl p-12 text-center overflow-hidden bg-gradient-to-br from-primary to-primary/70 shadow-2xl shadow-primary/30">
          <div className="absolute inset-0 bg-[url('/path-to-grid.svg')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Ace Your Exam?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
              Stop struggling and start learning smarter. Join thousands of
              students who trust ExamSarthi to guide them to success.
            </p>
            <Button
              onClick={onGetStarted}
              size="lg"
              variant="secondary"
              className="bg-background text-primary hover:bg-background/90 hover:text-primary scale-110 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Free Trial Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 8. Footer Section
// -----------------------------------------------------------------------------
const Footer = () => {
  return (
    <footer className="border-t border-border/40">
      <div className="container max-w-7xl py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold">ExamSarthi</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ExamSarthi. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// -----------------------------------------------------------------------------
// 9. Main Landing Page Component
// -----------------------------------------------------------------------------
// This component wraps all the landing page sections together.
export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FinalCTA onGetStarted={onGetStarted} />
      </main>
      <Footer />
    </div>
  );
}
