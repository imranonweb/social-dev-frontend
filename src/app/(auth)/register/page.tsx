"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { AuthCard } from "@/components/auth/auth-card";
import { GitHubButton } from "@/components/auth/github-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showErrorToast } from "@/lib/alerts";
import {
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { registerWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation rules per assignment specification
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUppercase && hasLowercase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      showErrorToast("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    // Strict validation requirement check
    if (!hasUppercase) {
      showErrorToast(
        "Invalid Password",
        "Password must contain at least one uppercase letter (A-Z)."
      );
      return;
    }
    if (!hasLowercase) {
      showErrorToast(
        "Invalid Password",
        "Password must contain at least one lowercase letter (a-z)."
      );
      return;
    }
    if (!hasMinLength) {
      showErrorToast(
        "Invalid Password",
        "Password must be at least 6 characters in length."
      );
      return;
    }

    setLoading(true);
    const success = await registerWithEmail(
      name.trim(),
      email.trim(),
      password,
      photoURL.trim() || undefined
    );
    setLoading(false);

    if (success) {
      router.push(redirectPath);
    }
  };

  return (
    <AuthCard
      title="Join CareServe"
      description="Create a community account to organize or participate in local initiatives"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href={`/login${redirectPath !== "/" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <GitHubButton text="Sign up with GitHub" />

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
          Or register with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g. Tanvir Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="tanvir@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>

        {/* Photo URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Photo URL (Optional)
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Real-time Requirement Checklist */}
          {password.length > 0 && (
            <div className="pt-2 space-y-1 bg-muted/40 p-2.5 rounded-lg border border-border/50 text-xs">
              <p className="font-semibold text-muted-foreground mb-1">
                Password Requirements:
              </p>
              <div className="flex items-center gap-2">
                {hasUppercase ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-rose-500" />
                )}
                <span className={hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                  At least 1 uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLowercase ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-rose-500" />
                )}
                <span className={hasLowercase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                  At least 1 lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-rose-500" />
                )}
                <span className={hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                  Minimum 6 characters ({password.length}/6)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || (password.length > 0 && !isPasswordValid)}
          className="w-full h-10 mt-3 font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Volunteer Account"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

