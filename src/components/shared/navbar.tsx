"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  CalendarPlus,
  CalendarCheck,
  CalendarDays,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/events"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/events")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Compass className="h-4 w-4" />
            Upcoming Events
          </Link>

          {/* Quick link for authenticated organizers */}
          {user && (
            <Link
              href="/create-event"
              className={cn(
                "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isActive("/create-event")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <CalendarPlus className="h-4 w-4" />
              Create Event
            </Link>
          )}
        </nav>

        {/* Right Section: Theme Toggle & Auth State */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Auth State Conditional Rendering */}
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              {/* Profile Avatar with Hover Tooltip */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Tooltip content={user.name || user.email || "User Profile"}>
                    <button
                      type="button"
                      className="rounded-full ring-2 ring-primary/30 hover:ring-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Open user menu"
                    >
                      <Avatar
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        fallback={user.name || user.email || "U"}
                        className="h-9 w-9 cursor-pointer"
                      />
                    </button>
                  </Tooltip>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl">
                  <DropdownMenuLabel className="border-b border-border/50 pb-2 mb-1">
                    <p className="font-semibold text-foreground truncate">{user.name || "Volunteer"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuItem>
                    <Link href="/create-event" className="flex items-center gap-2 w-full">
                      <CalendarPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Create Event</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href="/manage-events" className="flex items-center gap-2 w-full">
                      <CalendarDays className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span>Manage Events</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href="/joined-events" className="flex items-center gap-2 w-full">
                      <CalendarCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Joined Events</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout} destructive className="cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Explicit Logout Button alongside avatar as mandated by PDF */}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:inline-block">
                <Button size="sm" className="shadow-sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                isActive("/") ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                isActive("/events") ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Compass className="h-4 w-4" />
              Upcoming Events
            </Link>

            {user && (
              <>
                <Link
                  href="/create-event"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    isActive("/create-event") ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <CalendarPlus className="h-4 w-4" />
                  Create Event
                </Link>
                <Link
                  href="/manage-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    isActive("/manage-events") ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <CalendarDays className="h-4 w-4" />
                  Manage Events
                </Link>
                <Link
                  href="/joined-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    isActive("/joined-events") ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <CalendarCheck className="h-4 w-4" />
                  Joined Events
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    isActive("/profile") ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
              </>
            )}
          </nav>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            {user ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out ({user.name || user.email})
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
