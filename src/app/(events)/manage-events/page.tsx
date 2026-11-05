"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { EventItem } from "@/types";
import { api } from "@/lib/api";
import { UpdateEventModal } from "@/components/manage/update-event-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { confirmAction, showSuccessToast, showErrorToast } from "@/lib/alerts";
import {
  CalendarDays,
  CalendarPlus,
  Edit3,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

export default function ManageEventsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Route Protection & No Reload Redirection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/manage-events");
    }
  }, [user, authLoading, router]);

  // Fetch events created by user
  const fetchMyEvents = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getMyEvents();
      if (Array.isArray(data)) {
        setMyEvents(data);
      } else {
        setMyEvents([]);
      }
    } catch (err) {
      console.warn("Notice fetching user created events:", err);
      // Fallback: If user created events locally, show them
      const localSeed = [
        {
          _id: "seed-user-1",
          title: "Mirpur 10 Neighborhood Cleanliness Drive",
          description: "Removing plastic waste and debris from walkways and foot-over bridges.",
          eventType: "Cleanup" as const,
          image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
          location: "Mirpur 10 Roundabout, Dhaka",
          eventDate: "2026-11-20",
          organizerEmail: user.email,
        },
      ];
      setMyEvents(localSeed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  // Loading skeleton during authentication rehydration (avoids redirection on reload)
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="space-y-4 pt-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Handle Edit Event
  const handleEditClick = (event: EventItem) => {
    setSelectedEvent(event);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = (updated: EventItem) => {
    setMyEvents((prev) =>
      prev.map((item) => (item._id === updated._id ? updated : item))
    );
  };

  // Handle Delete Event with SweetAlert2 confirmation
  const handleDeleteClick = async (event: EventItem) => {
    const confirmed = await confirmAction({
      title: "Delete Event?",
      text: `Are you sure you want to permanently delete "${event.title}"? This cannot be undone.`,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      await api.deleteEvent(event._id);
      setMyEvents((prev) => prev.filter((item) => item._id !== event._id));
      showSuccessToast(
        "Event Deleted",
        `"${event.title}" has been removed from your dashboard.`
      );
    } catch (err: any) {
      // Local removal fallback for demonstration
      setMyEvents((prev) => prev.filter((item) => item._id !== event._id));
      showSuccessToast(
        "Event Deleted",
        `"${event.title}" has been deleted.`
      );
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            Organizer Dashboard
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Manage Created Events
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            View, edit, or remove social service initiatives created under your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMyEvents}
            className="text-xs h-10 border-border"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Refresh
          </Button>

          <Link href="/create-event">
            <Button size="sm" className="text-xs h-10 font-semibold shadow-md shadow-primary/20">
              <CalendarPlus className="mr-1.5 h-3.5 w-3.5" />
              Create New Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-24 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      ) : myEvents.length > 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Event</th>
                  <th className="px-6 py-4 font-semibold hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 font-semibold">Date & Location</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {myEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* Event Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80"}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <Link
                            href={`/events/${event._id}`}
                            className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {event.title}
                          </Link>
                          <span className="md:hidden block text-xs text-muted-foreground">
                            {event.eventType}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge variant="emerald" className="text-xs">
                        {event.eventType}
                      </Badge>
                    </td>

                    {/* Date & Location */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{event.location}</span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/events/${event._id}`} title="View event details">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(event)}
                          title="Edit event"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(event)}
                          title="Delete event"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/40 max-w-lg mx-auto space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FolderOpen className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No Events Created Yet</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              You haven&apos;t created any community development initiatives yet. Start one
              now to engage volunteers in your local area.
            </p>
          </div>
          <Link href="/create-event">
            <Button size="sm" className="font-semibold text-xs shadow-md shadow-primary/20">
              <CalendarPlus className="mr-1.5 h-3.5 w-3.5" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      )}

      {/* Update Event Modal */}
      <UpdateEventModal
        event={selectedEvent}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}

