import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  ShieldCheck,
  UsersRound,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: MapPin,
    badge: "Hyperlocal Focus",
    title: "Neighborhood-First Discovery",
    description:
      "Find grassroots social service campaigns happening right in your ward or area—such as Mirpur cleanliness drives or Dhanmondi Lake cleanups.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    badge: "Verified Organizers",
    title: "Authentic & Safe Initiatives",
    description:
      "Every campaign organizer is tied to an authenticated community account with explicit organizer contact details and strict future-date scheduling.",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: UsersRound,
    badge: "Instant RSVPs",
    title: "Real-Time Participant Tracking",
    description:
      "One-click attendance confirmation with real-time participation status checks to prevent duplicate sign-ups and coordinate on-site logistics.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: HeartHandshake,
    badge: "Diverse Causes",
    title: "Multi-Track Social Impact",
    description:
      "Whether planting saplings, distributing winter blankets to the homeless, or donating blood, find organized causes that match your passion.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 lg:mb-16">
          <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            Platform Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built for Real, Tangible Community Change
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            CareServe provides modern, frictionless tools for community leaders
            and compassionate citizens to unite around vital local causes.
          </p>
        </div>

        {/* 4-Card Equal Height Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="flex flex-col justify-between border-border/80 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200 group"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bg} ${feature.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="w-fit text-[11px] font-semibold text-muted-foreground">
                    {feature.badge}
                  </Badge>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
          >
            <span>Explore all open community drives</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

