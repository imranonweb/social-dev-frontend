import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Calendar } from "lucide-react";

interface GalleryPhoto {
  title: string;
  category: string;
  location: string;
  date: string;
  image: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    title: "Youth Cleanliness Campaign",
    category: "Waste Management",
    location: "Mirpur 10, Dhaka",
    date: "October 2026",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Urban Tree Plantation Initiative",
    category: "Afforestation",
    location: "Dhanmondi Lake Walkway",
    date: "September 2026",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Winter Blanket Distribution",
    category: "Humanitarian Relief",
    location: "Mohammadpur Town Hall",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Voluntary Blood Donation Camp",
    category: "Healthcare Support",
    location: "Chittagong Medical Center",
    date: "August 2026",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Surplus Food Redistribution",
    category: "Zero Hunger",
    location: "Bahadur Shah Park, Dhaka",
    date: "July 2026",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Street Children Book Distribution",
    category: "Education Outreach",
    location: "Karwan Bazar, Dhaka",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
  },
];

export function PhotoGallery() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            <Camera className="h-3.5 w-3.5 mr-1" />
            Impact in Pictures
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Moments of Community Action
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Real snapshots from grassroots cleanliness drives, afforestation projects,
            and humanitarian relief activities organized by our volunteers.
          </p>
        </div>

        {/* 6-Photo Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/80 bg-muted shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.image}
                alt={photo.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient Overlay & Text Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 flex flex-col justify-end text-white transition-opacity">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                  {photo.category}
                </span>
                <h3 className="text-lg font-bold leading-snug drop-shadow-sm">
                  {photo.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-zinc-300 mt-2 pt-2 border-t border-white/20">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                    {photo.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-emerald-400 shrink-0" />
                    {photo.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

