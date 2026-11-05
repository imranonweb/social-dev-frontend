import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { FaXTwitter, FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa6";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 dark:bg-card/40 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission Column (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              CareServe is a community-driven platform empowering citizens to
              discover, organize, and participate in grassroots social initiatives
              across Bangladesh—from cleanliness campaigns and tree plantations
              to winter warmth and emergency blood drives.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CareServe on X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
              >
                {/* Official new X logo (strictly no Twitter bird) */}
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CareServe on GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <FaGithub className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CareServe on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CareServe on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Home Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  href="/events?eventType=Cleanliness"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Cleanliness Drives
                </Link>
              </li>
              <li>
                <Link
                  href="/events?eventType=Plantation"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Tree Plantation
                </Link>
              </li>
              <li>
                <Link
                  href="/events?eventType=Blood+Donation"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Blood Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Actions Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/create-event"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Organize an Event
                </Link>
              </li>
              <li>
                <Link
                  href="/manage-events"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/joined-events"
                  className="hover:text-primary transition-colors inline-block"
                >
                  My Joined Initiatives
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-primary transition-colors inline-block"
                >
                  Volunteer Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Mirpur, Dhaka - 1216, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <a
                  href="mailto:impact@careserve.org"
                  className="hover:text-primary transition-colors"
                >
                  impact@careserve.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CareServe Platform. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" /> for community impact
          </p>
        </div>
      </div>
    </footer>
  );
}

