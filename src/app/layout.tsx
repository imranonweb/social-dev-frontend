import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/shared/navbar";

export const metadata: Metadata = {
  title: "CareServe | Community Social Development Events Platform",
  description:
    "A community-driven event management platform to discover, organize, join, and track local social service events such as Cleanliness Drives, Tree Plantation, Blanket Distribution, Blood Donation, and Food Relief.",
  keywords: [
    "Community Service",
    "Social Development",
    "Cleanliness Drive",
    "Tree Plantation",
    "Blood Donation",
    "Volunteer Bangladesh",
    "CareServe",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
