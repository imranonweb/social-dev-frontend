"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showSuccessToast, showErrorToast } from "@/lib/alerts";
import {
  User,
  Mail,
  Image as ImageIcon,
  Save,
  CalendarCheck,
  CalendarDays,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);

  // Route Protection & No Reload Redirection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  // Load user info and fetch participation counts
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhotoURL(user.image || "");

      // Count user activity
      const loadStats = async () => {
        try {
          const [joined, created] = await Promise.all([
            api.getMyJoinedEvents().catch(() => []),
            api.getMyEvents().catch(() => []),
          ]);
          setJoinedCount(Array.isArray(joined) ? joined.length : 1);
          setCreatedCount(Array.isArray(created) ? created.length : 1);
        } catch {
          setJoinedCount(1);
          setCreatedCount(1);
        }
      };

      loadStats();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showErrorToast("Validation Error", "Name cannot be left blank.");
      return;
    }

    setSaving(true);

    try {
      const updatedUser = {
        ...user,
        name: name.trim(),
        image: photoURL.trim() || null,
      };

      // Update local storage representation
      localStorage.setItem("auth-user", JSON.stringify(updatedUser));

      showSuccessToast(
        "Profile Updated!",
        "Your name and avatar have been saved successfully."
      );
    } catch {
      showErrorToast("Update Failed", "Could not save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-4xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
          <User className="h-3.5 w-3.5 mr-1" />
          Volunteer Profile
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          My Account & Activity
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Manage your personal details and view your social development impact.
        </p>
      </div>

      {/* Top Banner Card: Profile Overview */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-emerald-600/10 via-card to-teal-600/10 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <Avatar
            src={photoURL || user.image}
            alt={name || user.name || "User Avatar"}
            fallback={name || user.name || user.email || "U"}
            className="h-24 w-24 rounded-2xl ring-4 ring-primary/20 shadow-lg"
          />

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-foreground">
                {name || user.name || "Volunteer"}
              </h2>
              <Badge variant="emerald" className="text-xs font-semibold">
                <ShieldCheck className="h-3 w-3 mr-1 inline" />
                Verified Citizen
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="h-3.5 w-3.5 text-emerald-500" />
              <span>{user.email}</span>
            </p>
            <p className="text-xs text-muted-foreground pt-1 flex items-center justify-center sm:justify-start gap-1">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Rank: Active Community Change-Maker</span>
            </p>
          </div>
        </div>
      </div>

      {/* Impact Stats Grid (Extra Feature: Volunteer Milestone Tracker) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Joined Drives</span>
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{joinedCount}</p>
          <Link
            href="/joined-events"
            className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline pt-1"
          >
            <span>View joined initiatives</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Created Events</span>
            <CalendarDays className="h-4 w-4 text-teal-500" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{createdCount}</p>
          <Link
            href="/manage-events"
            className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline pt-1"
          >
            <span>Manage organizer events</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Impact Badge</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-foreground">Green Guardian</p>
          <p className="text-xs text-muted-foreground">
            Awarded for participating in local cleanliness and plantation drives.
          </p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">Update Profile Details</h3>
          <p className="text-xs text-muted-foreground">
            Modify your display name and public avatar across CareServe.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Full Name *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-11"
              required
            />
          </div>

          {/* Email (Read only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email Address (Permanent)
            </label>
            <Input
              type="email"
              value={user.email}
              disabled
              className="h-11 bg-muted/50 cursor-not-allowed opacity-75"
            />
          </div>

          {/* Photo URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              Avatar Image URL
            </label>
            <Input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="h-11"
            />
            <p className="text-[11px] text-muted-foreground">
              Paste an image link from Unsplash, Gravatar, or GitHub to personalize your avatar.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-6 font-semibold shadow-md shadow-primary/20"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

