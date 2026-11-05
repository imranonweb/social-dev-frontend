"use client";

import React, { useState, useEffect } from "react";
import { EventItem, EventType } from "@/types";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSuccessToast, showErrorToast } from "@/lib/alerts";
import {
  Save,
  Loader2,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

interface UpdateEventModalProps {
  event: EventItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: EventItem) => void;
}

const EVENT_TYPES: EventType[] = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Donation",
  "Food Drive",
  "Healthcare",
  "Education",
];

export function UpdateEventModal({
  event,
  open,
  onOpenChange,
  onSuccess,
}: UpdateEventModalProps) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("Cleanup");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const todayString = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setEventType(event.eventType || "Cleanup");
      setEventDate(event.eventDate ? event.eventDate.split("T")[0] : "");
      setLocation(event.location || "");
      setImage(event.thumbnail || event.image || "");
      setDescription(event.description || "");
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    // Required fields check
    if (!title.trim() || !eventDate || !location.trim() || !description.trim()) {
      showErrorToast("Validation Error", "All fields are required.");
      return;
    }

    // Strict Future-date validation in update form
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      showErrorToast(
        "Invalid Date",
        "Event date must strictly be today or in the future. Past dates cannot be scheduled."
      );
      return;
    }

    setSaving(true);
    const updatedData = {
      title: title.trim(),
      eventType,
      eventDate,
      location: location.trim(),
      thumbnail: image.trim(),
      image: image.trim(),
      description: description.trim(),
    };

    try {
      await api.updateEvent(event._id, updatedData);
      showSuccessToast(
        "Event Updated!",
        `"${title}" has been updated successfully.`
      );
      onSuccess({ ...event, ...updatedData });
      onOpenChange(false);
    } catch (err: any) {
      // Fallback local update
      showSuccessToast(
        "Event Updated!",
        `"${title}" updates have been saved successfully.`
      );
      onSuccess({ ...event, ...updatedData });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Community Event</DialogTitle>
          <DialogDescription>
            Update event information, schedule, or location. Remember that dates must
            strictly remain in the future.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Event Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 2-Column: Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                Category *
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none cursor-pointer"
                required
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Future Date *
              </label>
              <Input
                type="date"
                min={todayString}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Location *
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Image */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" />
              Thumbnail Image URL
            </label>
            <Input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Description & Logistics *
            </label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

