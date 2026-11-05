"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccessToast, showErrorToast } from "@/lib/alerts";
import { Mail, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showErrorToast("Invalid Email", "Please enter a valid email address to subscribe.");
      return;
    }

    setSubscribed(true);
    showSuccessToast(
      "Subscribed!",
      "Thank you for joining our community newsletter. You will receive bi-weekly updates."
    );
    setEmail("");
  };

  return (
    <section className="py-16 md:py-20 bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-emerald-600/10 via-card to-teal-600/10 p-8 sm:p-12 lg:p-16 shadow-xl backdrop-blur-md">
          {/* Subtle Ambient Background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
              <Mail className="h-6 w-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Stay Connected With Local Action
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Subscribe to the CareServe bi-weekly dispatch. Get early announcements
              on upcoming cleanliness drives, tree plantations, emergency blood calls,
              and volunteer impact stories across Bangladesh.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-background/80 border-border/80 rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 px-6 rounded-xl font-semibold shadow-md shadow-primary/20 shrink-0"
              >
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero Spam Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Unsubscribe Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

