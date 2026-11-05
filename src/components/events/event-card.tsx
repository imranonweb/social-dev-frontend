import Link from "next/link";
import { EventItem } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight, UserCheck } from "lucide-react";

interface EventCardProps {
  event: EventItem;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  // Select badge styling by event type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Cleanliness":
      case "Cleanup":
        return "emerald";
      case "Plantation":
        return "emerald";
      case "Blood Donation":
      case "Healthcare":
        return "destructive";
      case "Donation":
      case "Food Drive":
        return "amber";
      default:
        return "secondary";
    }
  };

  const organizerName = event.creatorName || event.organizerName || "Verified Organizer";

  return (
    <Card className={`group flex flex-col justify-between overflow-hidden border border-border/80 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 rounded-2xl ${className}`}>
      {/* Top Image Container with Uniform Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail || event.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"}
          alt={event.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Ambient Gradient on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3">
          <Badge variant={getBadgeVariant(event.eventType) as any} className="shadow-md backdrop-blur-md font-semibold text-xs px-2.5 py-0.5">
            {event.eventType}
          </Badge>
        </div>

        {/* Organizer pill overlay */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] text-white/95 font-medium drop-shadow-md">
          <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="truncate max-w-[180px]">{organizerName}</span>
        </div>
      </div>

      {/* Card Header & Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <CardHeader className="p-0 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex-1">
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </CardDescription>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </CardContent>
      </div>

      {/* Card Footer: View Event Button */}
      <CardFooter className="p-5 pt-0 border-t border-border/40 mt-auto">
        <Link href={`/events/${event._id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all text-xs h-9 rounded-xl"
          >
            <span>View Event Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
