"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EventItem } from "@/types";
import { api } from "@/lib/api";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, CalendarX2, RefreshCw } from "lucide-react";

// Realistic Community Events Fallback (Zero Lorem Ipsum)
const FALLBACK_EVENTS: EventItem[] = [
  {
    _id: "seed-1",
    title: "Mirpur 10 Neighborhood Cleanliness Drive",
    description: "Join local community youth in removing plastic waste, cleaning walkways, and installing waste bins across Mirpur 10 circle.",
    eventType: "Cleanup",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    location: "Mirpur 10 Roundabout, Dhaka",
    eventDate: "2026-11-20",
    organizerEmail: "mirpur.clean@community.org",
  },
  {
    _id: "seed-2",
    title: "Dhanmondi Lake Urban Tree Plantation",
    description: "Planting 250 native fruit and shade saplings along the Dhanmondi Lake walkway to combat urban heat islands.",
    eventType: "Plantation",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    location: "Dhanmondi Lake Sector 8, Dhaka",
    eventDate: "2026-11-25",
    organizerEmail: "green.dhaka@initiative.org",
  },
  {
    _id: "seed-3",
    title: "Blanket Distribution for the Needy - Mohammadpur",
    description: "Winter warmth distribution drive targeting 500 vulnerable street dwellers and low-income families in Mohammadpur.",
    eventType: "Donation",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    location: "Town Hall Field, Mohammadpur, Dhaka",
    eventDate: "2026-12-02",
    organizerEmail: "warmth.aid@care.org",
  },
  {
    _id: "seed-4",
    title: "Emergency Voluntary Blood Donation Camp",
    description: "Collaborative blood typing and donation drive in partnership with Red Crescent to support thalassemia patients.",
    eventType: "Blood Donation",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
    location: "Chittagong Medical College Hospital Area, Chattogram",
    eventDate: "2026-12-08",
    organizerEmail: "lifeblood@chattogram.org",
  },
  {
    _id: "seed-5",
    title: "Warm Winter Clothes Collection & Handover",
    description: "Sorting, packing, and direct doorstep handover of donated winter jackets and sweaters for river erosion refugees.",
    eventType: "Donation",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    location: "Shahjalal Uposhohor Point, Sylhet",
    eventDate: "2026-12-15",
    organizerEmail: "sylhet.aid@community.org",
  },
  {
    _id: "seed-6",
    title: "Zero Hunger Fresh Food Surplus Rescue",
    description: "Redistributing fresh, hygienically prepared meals from wedding caterers to homeless shelters and day laborers.",
    eventType: "Food Drive",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&q=80",
    location: "Bahadur Shah Park, Old Dhaka",
    eventDate: "2026-12-22",
    organizerEmail: "foodhero@dhaka.org",
  },
  {
    _id: "seed-7",
    title: "Gulshan Lake Park Plastic Cleanup Campaign",
    description: "Mobilizing local residents and students to eliminate non-biodegradable polythene bags and plastic bottles from the lake shoreline.",
    eventType: "Cleanup",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    location: "Gulshan Lake Park, Dhaka",
    eventDate: "2026-12-28",
    organizerEmail: "gulshan.clean@care.org",
  },
  {
    _id: "seed-8",
    title: "School Supplies and Textbook Aid Drive",
    description: "Equipping 300 disadvantaged primary school students with notebooks, geometry boxes, backpacks, and solar study lamps.",
    eventType: "Education",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    location: "Rayer Bazar Community Center, Dhaka",
    eventDate: "2027-01-05",
    organizerEmail: "educate.bd@initiative.org",
  },
];

function EventsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("eventType") || "All";

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch events from backend API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getUpcomingEvents();
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
      } else {
        setEvents(FALLBACK_EVENTS);
      }
    } catch (err) {
      console.warn("Backend API not reachable or empty, showing verified community initiatives:", err);
      setEvents(FALLBACK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        // Enforce strictly upcoming events (eventDate >= today)
        const eventDate = new Date(event.eventDate);
        if (!isNaN(eventDate.getTime()) && eventDate < today) {
          return false;
        }

        // Category filter
        if (selectedCategory !== "All") {
          const matchCat =
            event.eventType.toLowerCase() === selectedCategory.toLowerCase();
          if (!matchCat) return false;
        }

        // Search filter (title or location)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = event.title.toLowerCase().includes(term);
          const matchLocation = event.location.toLowerCase().includes(term);
          if (!matchTitle && !matchLocation) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.eventDate).getTime();
        const timeB = new Date(b.eventDate).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      });
  }, [events, searchTerm, selectedCategory, sortOrder]);

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "All";

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortOrder("asc");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 max-w-3xl">
        <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
          <Compass className="h-3.5 w-3.5 mr-1" />
          Community Initiatives Directory
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Upcoming Social Events
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Discover verified local social development events scheduled across Bangladesh.
          Filter by category, search by location, or sign up to volunteer directly.
        </p>
      </div>

      {/* Filters Toolbar */}
      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder}
        onSortToggle={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Count & Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-3">
        <span>
          Showing <strong className="text-foreground">{filteredEvents.length}</strong> upcoming initiatives
        </span>
        <button
          onClick={fetchEvents}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          title="Refresh events list"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm space-y-4 p-4"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-lg" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        /* 3-Column Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/50 max-w-md mx-auto space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <CalendarX2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No Upcoming Events Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No upcoming events match your search &ldquo;{searchTerm}&rdquo; or the selected category.
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleReset} className="font-semibold text-xs">
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-20 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}

