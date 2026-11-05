import { CreateEventInput, EventItem, JoinedEvent, JoinStatusResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper utility for making authenticated requests
export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access-token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message) errorMsg = errorData.message;
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorMsg);
  }

  return res.json();
};

// API Client Methods matching backend specification
export const api = {
  // Auth Token Issue
  getToken: (email: string): Promise<{ token: string }> =>
    fetchWithAuth("/jwt", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Events API
  getRecentEvents: (): Promise<EventItem[]> => fetchWithAuth("/events/recent"),

  getUpcomingEvents: (params?: string): Promise<EventItem[]> =>
    fetchWithAuth(`/events${params ? `?${params}` : ""}`),

  getEventDetails: (id: string): Promise<EventItem> =>
    fetchWithAuth(`/events/${id}`),

  createEvent: (data: CreateEventInput): Promise<{ insertedId?: string; acknowledged?: boolean }> =>
    fetchWithAuth("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyEvents: (): Promise<EventItem[]> => fetchWithAuth("/my-events"),

  updateEvent: (
    id: string,
    data: Partial<CreateEventInput>
  ): Promise<{ modifiedCount?: number; acknowledged?: boolean }> =>
    fetchWithAuth(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string): Promise<{ deletedCount?: number; acknowledged?: boolean }> =>
    fetchWithAuth(`/events/${id}`, {
      method: "DELETE",
    }),

  // Joined Events API
  joinEvent: (data: {
    eventId: string;
    userName?: string;
    userPhoto?: string;
  }): Promise<{ insertedId?: string; acknowledged?: boolean }> =>
    fetchWithAuth("/joined-events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  checkJoinStatus: (eventId: string): Promise<JoinStatusResponse> =>
    fetchWithAuth(`/joined-events/check/${eventId}`),

  getMyJoinedEvents: (): Promise<JoinedEvent[]> =>
    fetchWithAuth("/joined-events"),

  cancelJoin: (id: string): Promise<{ deletedCount?: number; acknowledged?: boolean }> =>
    fetchWithAuth(`/joined-events/${id}`, {
      method: "DELETE",
    }),
};

