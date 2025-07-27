"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail, Lock, Chrome, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      // Handle Sign Up
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.displayName,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (res.ok) {
          alert("Account created successfully! Please sign in.");
          setIsSignUp(false); // Switch to sign-in form after successful registration
          setFormData({ ...formData, password: "" }); // Clear password field
        } else {
          const errorData = await res.json();
          alert(`Registration failed: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An unexpected error occurred during registration.");
      }
    } else {
      // Handle Sign In
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        alert(result.error);
      } else {
        // Redirect to home or dashboard after successful login
        window.location.href = "/";
      }
    }
  };

  const handleSocialLogin = async (provider: string) => {
    await signIn(provider, {
      callbackUrl: "/",
    });
  };

  const socialProviders = [
    {
      name: "Google",
      icon: Chrome,
      color: "hover:text-red-500",
      provider: "google",
    },
  ];

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">You are already logged in</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session.user?.name || "User"}!
          </p>
          <Link href="/" className="text-primary hover:underline mt-4">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="p-3 rounded-full bg-gradient-primary">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <span className="text-4xl font-bold bg-gradient-iq bg-clip-text text-transparent">
                IQ X
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Where Intelligence
              <span className="block text-primary">Meets Social</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Connect with brilliant minds, share groundbreaking ideas, and
              discover your intellectual potential in the most intelligent
              social network ever created.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold text-primary">195+</div>
              <div className="text-sm text-muted-foreground">Average IQ</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold text-success">50K+</div>
              <div className="text-sm text-muted-foreground">Geniuses</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold text-warning">1M+</div>
              <div className="text-sm text-muted-foreground">Ideas Shared</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex flex-col justify-center">
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-elegant">
            {/* Form Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                {isSignUp ? "Join the Elite" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Create your account and take the IQ test"
                  : "Sign in to your intellectual network"}
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="w-full h-12 transition-all duration-200 hover:shadow-card"
                  onClick={() => handleSocialLogin(provider.provider)}
                >
                  <provider.icon
                    className={`h-5 w-5 mr-3 transition-colors ${provider.color}`}
                  />
                  Continue with {provider.name}
                </Button>
              ))}
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-4 text-sm text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    type="text"
                    placeholder="Your brilliant name"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="genius@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Your secret formula"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isSignUp ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Create Account & Take IQ Test
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span className="font-semibold">Sign in</span>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <span className="font-semibold">Sign up</span>
                  </>
                )}
              </button>
            </div>

            {isSignUp && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary">IQ Test Included</p>
                    <p className="text-muted-foreground">
                      After registration, you&apos;ll take our comprehensive IQ
                      assessment to join the appropriate intellectual tier.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
