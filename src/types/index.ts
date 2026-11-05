export type EventType =
  | "Cleanup"
  | "Plantation"
  | "Donation"
  | "Healthcare"
  | "Education"
  | "Food Drive"
  | "Blood Donation";

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: EventType;
  image: string;
  location: string;
  eventDate: string; // ISO string e.g. YYYY-MM-DD
  organizerEmail: string;
  organizerName?: string;
  organizerPhoto?: string;
  createdAt?: string;
  updatedAt?: string;
  participantCount?: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  eventType: EventType;
  image: string;
  location: string;
  eventDate: string;
  organizerEmail?: string;
  organizerName?: string;
  organizerPhoto?: string;
}

export interface JoinedEvent {
  _id: string;
  eventId: string;
  title?: string;
  description?: string;
  eventType?: EventType;
  image?: string;
  location?: string;
  eventDate: string;
  organizerEmail?: string;
  userEmail: string;
  userName?: string;
  userPhoto?: string;
  joinedAt?: string;
}

export interface JoinStatusResponse {
  hasJoined: boolean;
  joinedAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

