import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturesSection } from "@/components/home/features-section";
import { RecentEvents } from "@/components/home/recent-events";
import { PhotoGallery } from "@/components/home/photo-gallery";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Community Hero & Impact Counter */}
      <HeroBanner />

      {/* 2. Platform Key Features Grid */}
      <FeaturesSection />

      {/* 3. 6 Nearest Recent Upcoming Events (Dynamic with Skeletons) */}
      <RecentEvents />

      {/* 4. Photo Gallery Showcase */}
      <PhotoGallery />

      {/* 5. Interactive Newsletter Subscription */}
      <Newsletter />
    </div>
  );
}
