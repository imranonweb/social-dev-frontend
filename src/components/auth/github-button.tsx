"use client";

import React, { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

export function GitHubButton({ text = "Continue with GitHub" }: { text?: string }) {
  const { loginWithGitHub } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      await loginWithGitHub();
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGitHubLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 h-10 border-border/80 bg-background hover:bg-muted font-medium transition-all"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <FaGithub className="h-4 w-4 text-foreground" />
      )}
      <span>{text}</span>
    </Button>
  );
}

