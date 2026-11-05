import { CreateEventInput, EventItem, JoinedEvent, JoinStatusResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper utility for making authenticated requests
export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("access-token");

    // If token not found in localStorage, check cookie
    if (!token) {
      const match = document.cookie.match(/(?:^|;\s*)access-token=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
        localStorage.setItem("access-token", token);
      }
    }

    // If still missing, check cached auth user email and request a fresh token
    if (!token) {
      const cached = localStorage.getItem("auth-user");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          if (u.email) {
            const tokenRes = await fetch(`${API_BASE_URL}/jwt`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: u.email }),
            });
            if (tokenRes.ok) {
              const data = await tokenRes.json();
              if (data.token) {
                token = data.token;
                localStorage.setItem("access-token", data.token);
                document.cookie = `access-token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
              }
            }
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  let res = await fetch(url, { ...options, headers });

  // If token is expired or unauthorized (401/403), attempt recovery once
  if ((res.status === 401 || res.status === 403) && typeof window !== "undefined") {
    const cached = localStorage.getItem("auth-user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u.email) {
          const refreshRes = await fetch(`${API_BASE_URL}/jwt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: u.email }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data.token) {
              localStorage.setItem("access-token", data.token);
              document.cookie = `access-token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
              headers.Authorization = `Bearer ${data.token}`;
              res = await fetch(url, { ...options, headers });
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }

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
    // Ensure thumbnail property is provided for backend validation
    const payload = {
      ...data,
      thumbnail:
        data.thumbnail ||
        data.image ||
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
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
