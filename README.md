# CareServe — Social Development Events Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn-UI-black?style=flat)](https://ui.shadcn.com/)
[![Better-Auth](https://img.shields.io/badge/Better--Auth-v1.7-emerald?style=flat)](https://better-auth.com/)

A modern, high-craft, community-driven event management platform where citizens discover, organize, join, and track local social service initiatives across Bangladesh (Cleanliness Drives, Urban Tree Plantation, Winter Blanket Distribution, Blood Donation Camps, and Food Rescue Drives).

Built for **Assignment B14-A8_Cat-Hermione**.

---

## 🌐 Live Deployments & Repositories

- **Client Live Site**: [https://social-dev-frontend.vercel.app](https://social-dev-frontend.vercel.app) *(or your Vercel deployment URL)*
- **Server Live API**: [https://social-dev-backend.onrender.com](https://social-dev-backend.onrender.com) *(or your local `http://localhost:5000`)*
- **Client Repository**: [https://github.com/imranonweb/social-dev-frontend](https://github.com/imranonweb/social-dev-frontend)
- **Backend Repository**: [https://github.com/imranonweb/social-dev-backend](https://github.com/imranonweb/social-dev-backend)

---

## ✨ Key Features

1. **Edge Route Protection & Session Rehydration (Zero Reload Redirection)**:
   - Next.js 16 Edge proxy (`src/proxy.ts`) protects all private routes (`/create-event`, `/manage-events`, `/joined-events`, `/profile`).
   - Seamless session rehydration with skeleton loading ensures logged-in users are never redirected to login upon refreshing private routes (`F5`).
2. **Dual-Layer Authentication (Better-Auth + Express JWT)**:
   - Supports Email/Password (with strict uppercase, lowercase, and 6+ character password validation) and GitHub OAuth.
   - Automatically bridges Better-Auth sessions with Express backend JWT tokens via `POST /jwt`, keeping client requests authorized with `Bearer` tokens and auto-refresh mechanisms.
3. **Dynamic Community Event Management (CRUD)**:
   - **Create Event**: Strict future-date validation (`min={today}`), category tagging, location mapping, and thumbnail preview.
   - **Manage Events**: User-specific dashboard with inline update modal and SweetAlert2-backed confirmation for deletions.
4. **State-Aware Volunteer Registration**:
   - Event details page (`/events/[id]`) checks real-time participation status via `GET /joined-events/check/:id`.
   - Dynamic button displays "Join Event" or "Already Joined" with instant celebration toast feedback.
5. **Interactive Filtering & Chronological Tracking**:
   - Live text search, event type filtering (Cleanup, Plantation, Donation, Blood Drive, Food Drive, Healthcare, Education), and ascending/descending date sorting.
   - Dedicated "Joined Events" dashboard displaying user commitments chronologically with a single-click "Cancel Attendance" workflow.
6. **Minimal Shadcn Toast & Dark/Light Theming**:
   - Modern top-right Shadcn Sonner toasts equipped with explicit dismiss (`cross`) buttons and color-coded status badges.
   - Global dark/light theme switching with zero layout shift powered by `next-themes` and OKLCH color tokens.
7. **Strict Brand & Content Hygiene**:
   - **Zero Lorem Ipsum**: 100% authentic Bangladesh community initiatives (Mirpur, Mohammadpur, Dhanmondi, Chittagong, Sylhet).
   - **Updated Brand Iconography**: Strictly utilizes the new **X** logo across all navigation and footer surfaces (no legacy Twitter bird).
   - **Zero Default Alerts**: All user feedback uses styled toasts and accessible dialogs.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Edge Proxy)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Base UI, tw-animate-css
- **UI Components**: Shadcn UI (Dialog, DropdownMenu, Avatar, Badge, Input, Textarea, Card, Tooltip, Skeleton, Sonner)
- **Authentication**: Better-Auth (MongoDB Adapter) + GitHub OAuth Provider + Express JWT Bridge
- **Database**: MongoDB Atlas (`social_dev_db`)
- **Icons**: Lucide React & React Icons (`FaXTwitter`, `FaGithub`, `FaLinkedin`)
- **Notifications & Dialogs**: Shadcn Sonner + SweetAlert2

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn
- Running backend server (`http://localhost:5000` or deployed URL)
- MongoDB Atlas database URI

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/imranonweb/social-dev-frontend.git
cd social-dev-frontend/social-dev
npm install
```

### 3. Environment Variables Configuration

Create a `.env.local` file in `social-dev/`:

```env
# Better-Auth Configuration
BETTER_AUTH_SECRET="your-32-character-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth Credentials
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"

# MongoDB Database (Same database used by Better-Auth and backend)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"

# Express Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Route Architecture

| Route | Access | Description |
|---|---|---|
| `/` | Public | Hero banner, impact counters, recent 6 events, photo gallery, newsletter |
| `/events` | Public | Search, category filter, sort order, upcoming event cards |
| `/events/[id]` | Public / Protected Action | Event details, organizer information, state-aware join action |
| `/login` | Public (Guest only) | Email/password sign-in and GitHub OAuth |
| `/register` | Public (Guest only) | Registration with strict password validation rules |
| `/create-event` | Private | Form to publish community initiatives with future-date enforcement |
| `/manage-events`| Private | Manage created initiatives (Update details & Delete) |
| `/joined-events`| Private | Chronological list of joined initiatives with cancel action |
| `/profile` | Private | Volunteer profile dashboard with participation statistics |

---

## 🧪 Verification & Building

Run the production build:

```bash
npm run build
```

Verify TypeScript typing:

```bash
npx tsc --noEmit
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
