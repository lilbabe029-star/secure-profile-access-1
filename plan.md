# Implementation Plan - Black Sense Premium Contact Platform

Building a secure, premium contact marketplace with a locked-profile system, wallet functionality, and currency conversion for African regions.

## Scope & Non-Goals
- **Scope**: Frontend-only implementation using `localStorage` for data persistence (Users, Profiles, Transactions, Wallet).
- **Scope**: Implementation of 20 US-based profiles with specific pricing and locked/unlocked states.
- **Scope**: Wallet system with Tigo payment flow (manual admin approval simulation).
- **Scope**: Real-time currency conversion for African countries.
- **Non-Goals**: No real backend or database (Supabase/Postgres). No real payment gateway integration (manual reference ID only). No real email notifications.

## Assumptions & Open Questions
- **Assumption**: "Manual admin approval" will be simulated by an Admin Dashboard that modifies `localStorage` state.
- **Assumption**: Currency conversion rates will be hardcoded or fetched from a free API if available; otherwise, a fixed rate map will be used for stability.
- **Assumption**: Session persistence is handled via `localStorage`.

## Affected Areas
- **State Management**: Centralized store (using React Context or simple hooks) to manage global state (User, Wallet, Profiles, Transactions).
- **Authentication**: Custom hook/context for Login/Registration.
- **Marketplace**: Grid view of 20 profiles with blur/lock logic.
- **Wallet**: Deposit form, transaction history, and balance display.
- **Admin Panel**: Management interface for users, deposits, and profiles.
- **Currency**: Utility for real-time conversion across the app.

## Phase 1: Foundation & Data Modeling (frontend_engineer)
- Define TypeScript interfaces for `User`, `Profile`, `Transaction`, `Deposit`.
- Seed `localStorage` with 20 initial US-based profiles with random prices ($9, $10, $15, $18, $19, $20, $25, $30).
- Create a `CurrencyContext` to handle African currency selection and conversion logic.
- Deliverables: Data schemas and seeding logic.

## Phase 2: Authentication & Navigation (frontend_engineer)
- Implement Registration (with African country selection) and Login.
- Create Protected Routes for Dashboard, Marketplace, and Admin.
- Setup Layout with Dark/Light mode toggle and responsive navigation.
- Deliverables: Auth flow and shell application.

## Phase 3: Marketplace & Profile System (frontend_engineer)
- Build Marketplace grid displaying 20 profiles.
- Implement "Locked" state: Blur details, show "Unlock price" button in selected currency.
- Build Profile Detail page (Locked vs. Unlocked views).
- Deliverables: Functional marketplace with locking mechanism.

## Phase 4: Wallet & Payment Flow (frontend_engineer)
- Implement Wallet Dashboard showing balance in local currency.
- Create Deposit form (Tigo network details provided: 0560260335).
- Implement "Unlock Profile" logic: Check balance -> Deduct -> Persist unlock status.
- Deliverables: Wallet system and payment processing simulation.

## Phase 5: Admin Dashboard (frontend_engineer)
- Build Admin interface to:
    - Approve/Reject pending deposits.
    - Edit profile details/images/prices.
    - View all users and their unlock history.
- Ensure admin changes don't break existing user "unlocked" states (persistence check).
- Deliverables: Full admin control suite.

## Phase 6: Refinement & Security (quick_fix_engineer)
- Add smooth animations (Framer Motion).
- Finalize Dark/Light mode CSS variables.
- Ensure "No bypass" by verifying unlock status at the component level.
- Polish mobile responsiveness.
- Deliverables: Production-ready UI/UX.

## Sequencing & Ownership
1. **frontend_engineer**: Owns Phases 1-5 (Core architecture and features).
2. **quick_fix_engineer**: Owns Phase 6 (Styling, animations, and minor bug fixes).
