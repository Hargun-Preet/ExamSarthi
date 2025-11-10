import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import { supabase } from "../integrations/supabase/client";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Provider } from "@supabase/supabase-js";
import { Github, GraduationCap, Check, Loader2 } from "lucide-react";

// A simple Google icon component (since lucide-react doesn't have one)
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google</title>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Loading spinner component
const Spinner = () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    null | "google" | "github"
  >(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) throw error;
      toast({
        title: "Success!",
        description:
          "Account created. Please check your email for a verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    setSocialLoading(provider as "google" | "github");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setSocialLoading(null);
    }
    // No need to setLoading(false) on success, as it will redirect.
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* --- Left Column (Branding) --- */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-muted text-foreground relative overflow-hidden">
        {/* Logo at top-left */}
        <Link to="/" className="flex items-center gap-2 z-10">
          <GraduationCap className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg">ExamSarthi</span>
        </Link>

        {/* Main Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Start your journey to success.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Join thousands of students acing JEE, NEET, and UPSC with their
            personal AI study partner.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <span>AI-Powered 24/7 Tutoring</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <span>Unlimited PDF & Note Uploads</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <span>Personalized Study Plans</span>
            </li>
          </ul>
        </div>

        {/* Footer Text */}
        <p className="relative z-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} ExamSarthi. All rights reserved.
        </p>

        {/* Decorative Gradient */}
        <div className="absolute -bottom-1/3 -right-1/4 w-3/4 h-3/4 bg-primary/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* --- Right Column (Form) --- */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-background">
        <Card className="w-full max-w-md p-6 md:p-8 border-0 shadow-none md:border md:shadow-lg">
          <CardHeader className="text-center p-0 mb-6">
            <CardTitle className="text-3xl font-bold mb-2">
              Get Started
            </CardTitle>
            <CardDescription>
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {/* Social Logins */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleOAuthSignIn("google")}
                variant="outline"
                className="w-full text-base py-6"
                disabled={!!socialLoading}
              >
                {socialLoading === "google" ? (
                  <Spinner />
                ) : (
                  <GoogleIcon className="w-5 h-5 mr-3" />
                )}
                Continue with Google
              </Button>
              {/* <Button
                onClick={() => handleOAuthSignIn("github")}
                variant="outline"
                className="w-full text-base py-6"
                disabled={!!socialLoading}
              >
                {socialLoading === "github" ? (
                  <Spinner />
                ) : (
                  <Github className="w-5 h-5 mr-3" />
                )}
                Continue with GitHub
              </Button> */}
            </div>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-base py-6"
                    disabled={loading}
                  >
                    {loading && <Spinner />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Display Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-base py-6"
                    disabled={loading}
                  >
                    {loading && <Spinner />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
