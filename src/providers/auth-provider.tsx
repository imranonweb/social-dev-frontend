"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthUser } from "@/types";
import { api } from "@/lib/api";
import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth-client";
import { showErrorToast, showSuccessToast } from "@/lib/alerts";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  token: string | null;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, password: string, image?: string) => Promise<boolean>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  syncBackendToken: (email: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync token with backend Express /jwt endpoint
  const syncBackendToken = useCallback(async (email: string): Promise<string | null> => {
    try {
      const res = await api.getToken(email);
      if (res && res.token) {
        localStorage.setItem("access-token", res.token);
        // Set cookie so server-side middleware recognizes authenticated state
        if (typeof document !== "undefined") {
          document.cookie = `access-token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
        }
        setToken(res.token);
        return res.token;
      }
    } catch (err) {
      console.warn("Backend JWT sync notice:", err);
    }
    return null;
  }, []);

  // Listen to Better-Auth session hook
  const { data: sessionData, isPending } = useSession();

  useEffect(() => {
    const initAuth = async () => {
      // First check stored user in localStorage for instant rehydration (no redirect flash)
      const cachedUser = localStorage.getItem("auth-user");
      const cachedToken = localStorage.getItem("access-token");

      if (cachedToken) {
        setToken(cachedToken);
      }

      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          // ignore corrupted local state
        }
      }

      if (!isPending) {
        if (sessionData?.user) {
          const authUser: AuthUser = {
            id: sessionData.user.id,
            name: sessionData.user.name || "Community Volunteer",
            email: sessionData.user.email || "",
            image: sessionData.user.image,
          };
          setUser(authUser);
          localStorage.setItem("auth-user", JSON.stringify(authUser));

          // Ensure backend token is refreshed
          if (authUser.email) {
            await syncBackendToken(authUser.email);
          }
        } else if (!cachedUser) {
          setUser(null);
          // If no session, clean up stale cookies
          if (typeof document !== "undefined") {
            document.cookie = "access-token=; path=/; max-age=0";
          }
        }
        setLoading(false);
      }
    };

    initAuth();
  }, [sessionData, isPending, syncBackendToken]);

  // Email / Password Login
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        showErrorToast("Login Failed", res.error.message || "Invalid email or password");
        setLoading(false);
        return false;
      }

      // Sync with Express backend JWT
      await syncBackendToken(email);

      const loggedUser: AuthUser = {
        id: res.data?.user?.id || `user-${Date.now()}`,
        name: res.data?.user?.name || email.split("@")[0],
        email: email,
        image: res.data?.user?.image || null,
      };

      setUser(loggedUser);
      localStorage.setItem("auth-user", JSON.stringify(loggedUser));
      showSuccessToast("Welcome Back!", "Logged in successfully.");
      setLoading(false);
      return true;
    } catch (err: any) {
      showErrorToast("Login Error", err.message || "An unexpected error occurred");
      setLoading(false);
      return false;
    }
  };

  // Register with Email
  const registerWithEmail = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await signUp.email({
        name,
        email,
        password,
        image,
      });

      if (res.error) {
        showErrorToast("Registration Failed", res.error.message || "Could not register account");
        setLoading(false);
        return false;
      }

      // Sync with Express backend JWT
      await syncBackendToken(email);

      const registeredUser: AuthUser = {
        id: res.data?.user?.id || `user-${Date.now()}`,
        name,
        email,
        image: image || null,
      };

      setUser(registeredUser);
      localStorage.setItem("auth-user", JSON.stringify(registeredUser));
      showSuccessToast("Account Created!", "Registration completed successfully.");
      setLoading(false);
      return true;
    } catch (err: any) {
      showErrorToast("Registration Error", err.message || "An unexpected error occurred");
      setLoading(false);
      return false;
    }
  };

  // GitHub Social Login
  const loginWithGitHub = async (): Promise<void> => {
    try {
      await signIn.social({
        provider: "github",
        callbackURL: typeof window !== "undefined" ? window.location.origin : "/",
      });
    } catch (err: any) {
      showErrorToast("GitHub Sign-In Error", err.message || "Failed to initialize GitHub login");
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut();
    } catch (err) {
      console.warn("SignOut notice:", err);
    }
    localStorage.removeItem("access-token");
    localStorage.removeItem("auth-user");
    if (typeof document !== "undefined") {
      document.cookie = "access-token=; path=/; max-age=0";
    }
    setUser(null);
    setToken(null);
    showSuccessToast("Signed Out", "You have been logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        loginWithEmail,
        registerWithEmail,
        loginWithGitHub,
        logout,
        syncBackendToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
