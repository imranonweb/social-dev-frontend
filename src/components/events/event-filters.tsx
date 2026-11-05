"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOrder: "asc" | "desc";
  onSortToggle: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES = [
  "All",
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Donation",
  "Food Drive",
  "Healthcare",
  "Education",
];

export function EventFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortToggle,
  onReset,
  hasActiveFilters,
}: EventFiltersProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Real-time Text Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events by title or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-background/80"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-4 relative flex items-center">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background/80 pl-10 pr-4 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none cursor-pointer"
            aria-label="Filter by Event Category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Event Types" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order Toggle */}
        <div className="md:col-span-3 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSortToggle}
            className="flex-1 h-10 font-medium text-xs justify-between"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ArrowUpDown className="h-3.5 w-3.5 text-emerald-500" />
              <span>{sortOrder === "asc" ? "Date: Soonest" : "Date: Latest"}</span>
            </div>
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onReset}
              title="Reset all filters"
              aria-label="Reset all filters"
              className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

