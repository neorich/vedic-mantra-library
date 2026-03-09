# Design Proposal: Premium App Experience (Non-AI)

**Date**: 2026-03-10
**Status**: Approved

## Overview
Based on user preference, we are transforming the Vedic Mantra web library into a highly polished, interactive, and offline-capable Progressive Web Application (PWA). This ensures the platform feels and functions like a premium native app.

## 1. Aesthetics: Dark Mode & Micro-Interactions
The site currently defaults to a Light theme but has `next-themes` installed. We need to expose the toggle and add buttery-smooth transitions.

### Dark Mode Integration
- Create a `ThemeToggle` component (a sun/moon icon switch from `lucide-react`).
- Inject this toggle into the existing `Navbar` on the far right.
- Ensure all custom tailwind classes (like gradients and glassmorphism) have refined `dark:` variants (e.g., deep space blues for Shiva, soft glowing golds for Lakshmi).

### Animations (`framer-motion`)
- Wrap the main content blocks in `src/app/mantra/[slug]/page.tsx` with `<motion.div>` tags.
- Apply a `fadeInUp` animation (e.g., `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`) so the translation and benefits elegantly fade up as the user scrolls.

## 2. Category Expansion
Expand the database schema logic to include broader, high-search-volume intent categories.
- Example additions: `Protection`, `Wealth & Success`, `Morning Chants`, `Obstacle Removal`.
- Create a SQL seed script to map existing mantras to these new categories to ensure they aren't empty.

## 3. The Offline Experience: Progressive Web App (PWA)
Transform the Next.js site into an installable PWA so users can take the library anywhere (e.g., meditation retreats) without internet.

### Implementation
- Install `@ducanh2912/next-pwa` (the most robust PWA plugin for Next.js App Router).
- Wrap the Next.js config in `next.config.mjs` with the `withPWA` hoc.
- Generate and place necessary PWA manifest files (`manifest.json`) and specific icon sizes (`icon-192x192.png`, `icon-512x512.png`) in the `/public` directory.
- Verify that a service worker successfully registers and caches core HTML/JS/CSS assets for offline retrieval.
