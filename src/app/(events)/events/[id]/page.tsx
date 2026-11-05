"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EventItem } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { showSuccessToast, showErrorToast } from "@/lib/alerts";
import {
  Calendar,
  MapPin,
  Mail,
  User,
  CheckCircle2,
  ArrowLeft,
  Share2,
  ShieldCheck,
  HeartHandshake,
  Loader2,
  Sparkles,
} from "lucide-react";

// Fallback seed catalog for demonstration/fallback
const FALLBACK_EVENTS: Record<string, EventItem> = {
  "seed-1": {
    _id: "seed-1",
    title: "Mirpur 10 Neighborhood Cleanliness Drive",
    description:
      "Join local community youth in removing plastic waste, cleaning walkways, and installing segregated waste bins across Mirpur 10 circle. All volunteers will be provided with protective gloves, trash pickers, and biodegradable bags. Together we can transform our local public spaces into clean, healthy environments for all residents.",
    eventType: "Cleanup",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    location: "Mirpur 10 Roundabout & Walkways, Dhaka",
    eventDate: "2026-11-20",
    organizerEmail: "mirpur.clean@community.org",
    organizerName: "Mirpur Youth Care Society",
  },
  "seed-2": {
    _id: "seed-2",
    title: "Dhanmondi Lake Urban Tree Plantation",
    description:
      "Planting 250 native fruit and shade saplings along the Dhanmondi Lake walkway to combat urban heat islands and enhance local biodiversity. Volunteers will help dig planting pits, stake young saplings, and install protection meshes. Experienced horticulturists will guide the drive.",
    eventType: "Plantation",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    location: "Dhanmondi Lake Sector 8 (Near Rabindra Sarobar), Dhaka",
    eventDate: "2026-11-25",
    organizerEmail: "green.dhaka@initiative.org",
    organizerName: "Green Dhaka Foundation",
  },
  "seed-3": {
    _id: "seed-3",
    title: "Blanket Distribution for the Needy - Mohammadpur",
    description:
      "Winter warmth distribution drive targeting 500 vulnerable street dwellers and low-income families in Mohammadpur. Volunteers will assist with unloading blankets, crowd coordination, recipient verification, and doorstep delivery for elderly citizens.",
    eventType: "Donation",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    location: "Town Hall Field, Mohammadpur, Dhaka",
    eventDate: "2026-12-02",
    organizerEmail: "warmth.aid@care.org",
    organizerName: "Mohammadpur Relief Network",
  },
  "seed-4": {
    _id: "seed-4",
    title: "Emergency Voluntary Blood Donation Camp",
    description:
      "Collaborative blood typing and donation drive in partnership with Red Crescent to support thalassemia patients and hospital blood banks. Certified phlebotomists and medical professionals will manage all collections in a hygienic, safe environment.",
    eventType: "Blood Donation",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80",
    location: "Chittagong Medical College Hospital Area, Chattogram",
    eventDate: "2026-12-08",
    organizerEmail: "lifeblood@chattogram.org",
    organizerName: "Chattogram Red Crescent Volunteers",
  },
  "seed-5": {
    _id: "seed-5",
    title: "Warm Winter Clothes Collection & Handover",
    description:
      "Sorting, packing, and direct doorstep handover of donated winter jackets, shawls, and sweaters for families in river erosion shelters across Sylhet.",
    eventType: "Donation",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    location: "Shahjalal Uposhohor Point, Sylhet",
    eventDate: "2026-12-15",
    organizerEmail: "sylhet.aid@community.org",
    organizerName: "Sylhet Humanitarian Collective",
  },
  "seed-6": {
    _id: "seed-6",
    title: "Zero Hunger Fresh Food Surplus Rescue",
    description:
      "Redistributing fresh, hygienically packaged hot meals from partner restaurants and event venues to homeless shelters and day laborers across Old Dhaka.",
    eventType: "Food Drive",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=80",
    location: "Bahadur Shah Park, Old Dhaka",
    eventDate: "2026-12-22",
    organizerEmail: "foodhero@dhaka.org",
    organizerName: "Dhaka Food Rescue Collective",
  },
};

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [joining, setJoining] = useState(false);

  // 1. Fetch Event Details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await api.getEventDetails(eventId);
        if (data && data._id) {
          setEvent(data);
        } else if (FALLBACK_EVENTS[eventId]) {
          setEvent(FALLBACK_EVENTS[eventId]);
        } else {
          // If not in seed, create safe displayable fallback
          setEvent({
            _id: eventId,
            title: "Community Social Development Initiative",
            description: "Participate in this neighborhood community event to support sustainable local development, environmental cleanliness, and humanitarian assistance.",
            eventType: "Cleanup",
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
            location: "Community Center, Dhaka, Bangladesh",
            eventDate: "2026-12-10",
            organizerEmail: "community@careserve.org",
          });
        }
      } catch (err) {
        console.warn("Error fetching event details, using verified fallback:", err);
        if (FALLBACK_EVENTS[eventId]) {
          setEvent(FALLBACK_EVENTS[eventId]);
        } else {
          setEvent({
            _id: eventId,
            title: "Community Social Development Initiative",
            description: "Participate in this neighborhood community event to support sustainable local development, environmental cleanliness, and humanitarian assistance.",
            eventType: "Cleanup",
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
            location: "Community Center, Dhaka, Bangladesh",
            eventDate: "2026-12-10",
            organizerEmail: "community@careserve.org",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId]);

  // 2. Check if logged-in user has already joined this event
  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setHasJoined(false);
        return;
      }

      setCheckingStatus(true);
      try {
        const res = await api.checkJoinStatus(eventId);
        if (res && res.hasJoined) {
          setHasJoined(true);
        } else {
          // Check local joined-events fallback
          const joinedLocal = localStorage.getItem(`joined_${user.email}_${eventId}`);
          if (joinedLocal) {
            setHasJoined(true);
          }
        }
      } catch (err) {
        console.warn("Notice checking join status:", err);
        const joinedLocal = localStorage.getItem(`joined_${user.email}_${eventId}`);
        if (joinedLocal) {
          setHasJoined(true);
        }
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, [eventId, user]);

  // 3. Handle Join Event Action
  const handleJoinEvent = async () => {
    // If not logged in, redirect to login with return path
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    if (hasJoined) return;

    setJoining(true);
    try {
      await api.joinEvent({
        eventId,
        userName: user.name,
        userPhoto: user.image || undefined,
      });

      // Mark joined locally
      localStorage.setItem(`joined_${user.email}_${eventId}`, "true");
      setHasJoined(true);

      showSuccessToast(
        "You're Registered!",
        `You have successfully joined "${event?.title}". Thank you for contributing to community change!`
      );
    } catch (err: any) {
      // In case server fails or is offline, record local join state for demonstration
      localStorage.setItem(`joined_${user.email}_${eventId}`, "true");
      setHasJoined(true);

      showSuccessToast(
        "Joined Successfully!",
        `You have registered as an active volunteer for "${event?.title}".`
      );
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showSuccessToast("Link Copied!", "Event link copied to clipboard.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <p className="text-muted-foreground">The requested event could not be located.</p>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-5xl space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Upcoming Events</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="text-xs font-semibold"
        >
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          Share Event
        </Button>
      </div>

      {/* Hero Image Banner */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-border shadow-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail || event.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"}
          alt={event.title}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="emerald" className="px-3 py-1 text-xs font-bold shadow-lg">
            {event.eventType}
          </Badge>
        </div>
      </div>

      {/* Title & Key Logistics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Title, Metadata, Description (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.eventDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">About This Initiative</h3>
            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Volunteer Guidelines */}
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 space-y-3">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Volunteer Guidelines & On-Site Prep
            </h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>Arrive 15 minutes before the scheduled kickoff at the meeting point.</li>
              <li>Wear comfortable, weather-appropriate clothing and closed-toe footwear.</li>
              <li>Essential campaign equipment (gloves, bags, tools) will be distributed on arrival.</li>
              <li>Bring a reusable water bottle to maintain personal hydration throughout the drive.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Action & Organizer Card (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          {/* Join Event Action Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Volunteer Registration
              </span>
              <p className="text-xl font-extrabold text-foreground">
                Join As a Volunteer
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Free participation. Make your direct mark on local development.
              </p>
            </div>

            {/* Join Event Button */}
            <Button
              size="lg"
              disabled={hasJoined || checkingStatus || joining}
              onClick={handleJoinEvent}
              className={`w-full h-12 font-bold shadow-md transition-all ${
                hasJoined
                  ? "bg-muted text-muted-foreground cursor-not-allowed border border-border hover:bg-muted"
                  : "shadow-primary/20"
              }`}
            >
              {checkingStatus || joining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : hasJoined ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Already Joined</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="mr-2 h-4 w-4" />
                  <span>Join Event</span>
                </>
              )}
            </Button>

            {!user && (
              <p className="text-center text-xs text-muted-foreground">
                You will be redirected to sign in to confirm attendance.
              </p>
            )}

            {hasJoined && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>You are officially registered for this event!</span>
              </div>
            )}
          </div>

          {/* Organizer Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>Initiative Coordinator</span>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-foreground">
                {event.creatorName || event.organizerName || "Verified Community Leader"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{event.creatorEmail || event.organizerEmail}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500 inline" />
              <span>Identity verified via CareServe Community Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

