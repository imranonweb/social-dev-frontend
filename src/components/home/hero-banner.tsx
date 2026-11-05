import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  CalendarPlus,
  Users,
  TreePine,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Headline, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="emerald" className="px-3.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Community Action Hub
              </Badge>
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                Verified Social Initiatives in Bangladesh
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Empower Your Neighborhood.{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Drive Lasting Social Impact.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Connect with local citizen volunteers to organize and join
              high-impact community actions—from Mirpur cleanliness campaigns and
              Dhanmondi tree plantations to winter warmth distributions and emergency
              blood donation camps.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-7 font-bold shadow-lg shadow-primary/25 rounded-xl transition-transform hover:-translate-y-0.5">
                  <Compass className="mr-2 h-4 w-4" />
                  Explore Upcoming Events
                </Button>
              </Link>
              <Link href="/create-event" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-7 font-bold border-border/80 hover:bg-muted/80 rounded-xl transition-transform hover:-translate-y-0.5">
                  <CalendarPlus className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Start an Initiative
                </Button>
              </Link>
            </div>

            {/* Quick Trust Signals */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% Free & Community Led</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero Commercial Ads</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Real-Time RSVP Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Impact Metrics Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-border/80 bg-card/85 p-6 sm:p-7 shadow-2xl backdrop-blur-xl transition-all hover:border-primary/40">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Live Community Counter
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Active Across BD</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">Volunteers</span>
                  </div>
                  <p className="text-2xl font-black text-foreground">2,850+</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Active change-makers</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                    <TreePine className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">Afforestation</span>
                  </div>
                  <p className="text-2xl font-black text-foreground">14,200+</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Saplings planted</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                    <HeartHandshake className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">Winter Relief</span>
                  </div>
                  <p className="text-2xl font-black text-foreground">5,600+</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Warm blankets gifted</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">Cleanups</span>
                  </div>
                  <p className="text-2xl font-black text-foreground">420+</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Completed drives</p>
                </div>
              </div>

              {/* Quote / Sub-banner */}
              <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground italic flex items-center justify-between">
                <span>&ldquo;Small local acts, multiplied by millions, transform cities.&rdquo;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
