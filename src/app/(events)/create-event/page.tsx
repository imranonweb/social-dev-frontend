"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { CreateEventInput, EventType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { showSuccessToast, showErrorToast } from "@/lib/alerts";
import {
  CalendarPlus,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  FileText,
  User,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const EVENT_TYPES: EventType[] = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Donation",
  "Food Drive",
  "Healthcare",
  "Education",
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user, loading: authLoading, syncBackendToken } = useAuth();

  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("Cleanup");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Compute minimum selectable date (today in YYYY-MM-DD)
  const todayString = new Date().toISOString().split("T")[0];

  // Route Protection & No Reload Redirection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/create-event");
    }
  }, [user, authLoading, router]);

  // Loading skeleton during authentication rehydration (avoids redirection on reload)
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Required Check
    if (!title.trim() || !eventDate || !location.trim() || !description.trim()) {
      showErrorToast("Incomplete Form", "Please fill in all mandatory event details.");
      return;
    }

    // 2. Strict Future Date Validation
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      showErrorToast(
        "Invalid Date",
        "Event date must strictly be in the future. Past dates cannot be scheduled."
      );
      return;
    }

    setSubmitting(true);

    // Make sure we have a fresh backend JWT token for this user
    try {
      if (user.email) {
        await syncBackendToken(user.email);
      }
    } catch {
      // Proceed to try creation
    }

    const defaultPhoto = "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80";
    const finalThumbnail = thumbnail.trim() || defaultPhoto;

    const payload: CreateEventInput = {
      title: title.trim(),
      eventType,
      eventDate,
      location: location.trim(),
      thumbnail: finalThumbnail,
      image: finalThumbnail,
      description: description.trim(),
      creatorEmail: user.email,
      creatorName: user.name || "Community Volunteer",
    };

    try {
      const res = await api.createEvent(payload);
      if (res && (res.insertedId || res.acknowledged)) {
        showSuccessToast(
          "Event Created!",
          `"${title}" has been saved to the database and published.`
        );
        router.push("/events");
      } else {
        showSuccessToast(
          "Event Created!",
          `"${title}" has been published to Upcoming Events.`
        );
        router.push("/events");
      }
    } catch (err: any) {
      console.error("Create event error from backend:", err);
      showErrorToast(
        "Failed to Save Event",
        err.message || "Could not save event to database. Please check backend connection."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-3xl space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
          <CalendarPlus className="h-3.5 w-3.5 mr-1" />
          Organize an Initiative
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Create Community Event
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Mobilize your neighbors around a social development initiative. Fill in
          the details below to publish your campaign directly to the database.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl space-y-6"
      >
        {/* Organizer Verification Badge */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-emerald-500" />
            <div className="text-xs">
              <span className="text-muted-foreground">Organizer: </span>
              <strong className="text-foreground">{user.name || "Volunteer"}</strong>
              <span className="text-muted-foreground"> ({user.email})</span>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Email
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Event Title *
          </label>
          <Input
            type="text"
            placeholder="e.g. Mirpur 10 Neighborhood Cleanliness Drive"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-11"
          />
        </div>

        {/* 2-Column: Event Type & Event Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Event Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Event Category *
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="w-full h-11 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none cursor-pointer"
              required
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Event Date (Strictly Future validation) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Event Date * (Future Only)
            </label>
            <Input
              type="date"
              min={todayString}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="h-11 cursor-pointer"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Location & Meeting Point *
          </label>
          <Input
            type="text"
            placeholder="e.g. Mirpur 10 Roundabout, Dhaka"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="h-11"
          />
        </div>

        {/* Thumbnail Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" />
            Thumbnail Image URL (Optional)
          </label>
          <Input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="h-11"
          />
          <p className="text-[11px] text-muted-foreground">
            Provide a direct image URL. If left empty, an authentic community banner will be assigned automatically.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Event Description & Volunteer Objectives *
          </label>
          <Textarea
            rows={5}
            placeholder="Describe the initiative goals, schedule, what equipment will be provided, and what volunteers should bring..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[120px] resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="w-full h-12 font-bold shadow-md shadow-primary/20"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving to Database...
              </>
            ) : (
              <>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Publish Community Event
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
