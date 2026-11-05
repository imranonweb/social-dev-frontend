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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
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
  getToken: (email: string): Promise<{ success?: boolean; token: string }> =>
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

  createEvent: async (
    data: CreateEventInput
  ): Promise<{ insertedId?: string; acknowledged?: boolean }> => {
    // If token is not in storage, attempt to fetch using creatorEmail
    if (typeof window !== "undefined" && !localStorage.getItem("access-token")) {
      const email = data.creatorEmail || (localStorage.getItem("auth-user") ? JSON.parse(localStorage.getItem("auth-user")!).email : null);
      if (email) {
        try {
          const res = await api.getToken(email);
          if (res?.token) {
            localStorage.setItem("access-token", res.token);
          }
        } catch {
          // Continue anyway
        }
      }
    }

    // Ensure thumbnail property is provided for backend validation
    const payload = {
      ...data,
      thumbnail: data.thumbnail || data.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    };

    return fetchWithAuth("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMyEvents: (email?: string): Promise<EventItem[]> =>
    fetchWithAuth(`/my-events${email ? `?email=${encodeURIComponent(email)}` : ""}`),

  updateEvent: (
    id: string,
    data: Partial<CreateEventInput>
  ): Promise<{ modifiedCount?: number; acknowledged?: boolean }> => {
    const payload = {
      ...data,
      thumbnail: data.thumbnail || data.image,
    };
    return fetchWithAuth(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

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
