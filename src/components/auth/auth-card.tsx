import React from "react";
import { Logo } from "@/components/shared/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card className={cn("border border-border/80 bg-card/90 shadow-xl backdrop-blur-xl", className)}>
          <CardHeader className="space-y-1.5 text-center pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
          {footer && (
            <div className="border-t border-border/50 px-6 py-4 text-center text-xs text-muted-foreground">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

