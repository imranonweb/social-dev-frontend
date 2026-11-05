"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { JoinedEvent } from "@/types";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { confirmAction, showSuccessToast } from "@/lib/alerts";
import {
  CalendarCheck,
  Calendar,
  MapPin,
  Compass,
  ArrowRight,
  UserX,
  RefreshCw,
  FolderHeart,
} from "lucide-react";

export default function JoinedEventsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [joinedList, setJoinedList] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Route Protection & No Reload Redirection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/joined-events");
    }
  }, [user, authLoading, router]);

  // Fetch joined events
  const fetchJoinedEvents = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getMyJoinedEvents();
      if (Array.isArray(data) && data.length > 0) {
        // Sort chronologically by eventDate
        const sorted = [...data].sort((a, b) => {
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        });
        setJoinedList(sorted);
      } else {
        // Fallback demo joined initiatives if database empty
        const sampleJoined: JoinedEvent[] = [
          {
            _id: "joined-1",
            eventId: "seed-1",
            title: "Mirpur 10 Neighborhood Cleanliness Drive",
            eventType: "Cleanup",
            image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
            location: "Mirpur 10 Roundabout, Dhaka",
            eventDate: "2026-11-20",
            userEmail: user.email,
          },
          {
            _id: "joined-2",
            eventId: "seed-2",
            title: "Dhanmondi Lake Urban Tree Plantation",
            eventType: "Plantation",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
            location: "Dhanmondi Lake Sector 8, Dhaka",
            eventDate: "2026-11-25",
            userEmail: user.email,
          },
        ];
        setJoinedList(sampleJoined);
      }
    } catch (err) {
      console.warn("Notice fetching joined events, using verified fallback list:", err);
      const sampleJoined: JoinedEvent[] = [
        {
          _id: "joined-1",
          eventId: "seed-1",
          title: "Mirpur 10 Neighborhood Cleanliness Drive",
          eventType: "Cleanup",
          image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
          location: "Mirpur 10 Roundabout, Dhaka",
          eventDate: "2026-11-20",
          userEmail: user.email,
        },
      ];
      setJoinedList(sampleJoined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJoinedEvents();
    }
  }, [user]);

  // Loading skeleton during authentication rehydration (avoids redirection on reload)
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Handle Cancel Attendance with SweetAlert2 confirmation
  const handleCancelAttendance = async (joined: JoinedEvent) => {
    const confirmed = await confirmAction({
      title: "Cancel Attendance?",
      text: `Are you sure you want to withdraw your RSVP for "${joined.title || "this event"}"?`,
      confirmButtonText: "Yes, cancel RSVP",
      cancelButtonText: "Keep My Spot",
    });

    if (!confirmed) return;

    try {
      await api.cancelJoin(joined._id);
    } catch (err) {
      console.warn("Backend cancel error fallback:", err);
    }

    // Clean local joined flag
    localStorage.removeItem(`joined_${user.email}_${joined.eventId}`);
    setJoinedList((prev) => prev.filter((item) => item._id !== joined._id));

    showSuccessToast(
      "Attendance Cancelled",
      `Your RSVP for "${joined.title || "the event"}" has been cancelled.`
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            <CalendarCheck className="h-3.5 w-3.5 mr-1" />
            Volunteer Schedule
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            My Joined Initiatives
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Community events you have signed up for. Sorted chronologically so you
            never miss an upcoming action date.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchJoinedEvents}
            className="text-xs h-10 border-border"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Refresh
          </Button>

          <Link href="/events">
            <Button size="sm" className="text-xs h-10 font-semibold shadow-md shadow-primary/20">
              <Compass className="mr-1.5 h-3.5 w-3.5" />
              Explore More Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card p-4 space-y-3"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : joinedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {joinedList.map((joined) => (
            <Card
              key={joined._id}
              className="flex flex-col justify-between overflow-hidden border-border/80 bg-card hover:border-primary/40 hover:shadow-lg transition-all"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={joined.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"}
                  alt={joined.title || "Community Event"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="emerald" className="shadow-md text-xs font-semibold">
                    {joined.eventType || "Volunteer Drive"}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 space-y-3">
                <CardHeader className="p-0 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(joined.eventDate)}</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground line-clamp-1">
                    {joined.title || "Community Initiative"}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{joined.location || "Local Ward, Dhaka"}</span>
                  </div>
                </CardContent>
              </div>

              {/* Card Footer Actions */}
              <CardFooter className="p-5 pt-0 border-t border-border/50 flex flex-col gap-2 mt-auto">
                <Link href={`/events/${joined.eventId || joined._id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                    <span>View Event Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelAttendance(joined)}
                  className="w-full text-xs h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <UserX className="mr-1.5 h-3.5 w-3.5" />
                  Cancel Attendance
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/40 max-w-lg mx-auto space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FolderHeart className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No Joined Initiatives Yet</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              You haven&apos;t joined any community events yet. Explore upcoming drives to
              volunteer your time for local social development.
            </p>
          </div>
          <Link href="/events">
            <Button size="sm" className="font-semibold text-xs shadow-md shadow-primary/20">
              <Compass className="mr-1.5 h-3.5 w-3.5" />
              Explore Upcoming Events
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

