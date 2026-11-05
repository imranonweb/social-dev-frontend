import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 transition-opacity hover:opacity-90 select-none",
        className
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
        <HeartHandshake className="h-5 w-5" />
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500 bg-clip-text text-transparent">
            CareServe
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground -mt-1 hidden sm:block">
            Community Hub
          </span>
        </div>
      )}
    </Link>
  );
}

