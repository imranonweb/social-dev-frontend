import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 sm:py-32 flex flex-col items-center justify-center text-center space-y-6">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
        <HelpCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          404 - Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          The community initiative or page you are looking for does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link href="/">
          <Button className="h-11 px-6 font-semibold shadow-md shadow-primary/20">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
        <Link href="/events">
          <Button variant="outline" className="h-11 px-6 font-semibold">
            <Compass className="mr-2 h-4 w-4" />
            Explore Upcoming Events
          </Button>
        </Link>
      </div>
    </div>
  );
}

