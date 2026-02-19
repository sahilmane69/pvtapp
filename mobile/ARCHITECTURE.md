# Scalable React Native Architecture Design

## Overview

This architecture is designed to handle distinct user roles (Farmer/Delivery) with clear boundaries, scalable state management, and a robust navigation strategy. It leverages modern React Native practices and tools.

## Core Structure

We follow a **Feature-based structure** (also known as Domain-Driven Design layout) rather than organizing files by type (e.g., all components in one folder). This ensures scalability as the app grows.

```
src/
├── app/                    # Global app configuration (providers, theme, navigation entry)
├── assets/                 # Images, fonts, and static resources
├── features/               # Domain-specific logic
│   ├── auth/               # Authentication (Login, Register, OTP)
│   ├── farmer/             # Farmer-specific screens (Dashboard, Crop Management)
│   ├── delivery/           # Delivery-specific screens (route, Tasks)
│   └── shared/             # Shared components and hooks used across roles
├── components/             # Global generic UI components (Buttons, Inputs, Cards)
├── navigation/             # Navigation stacks and navigators
├── services/               # API clients (Axios, Supabase, Firebase)
├── store/                  # Global state management (Zustand/Redux)
├── utils/                  # Helper functions and constants
└── types/                  # Global TypeScript definitions
```

## Role Separation Strategy

### 1. Navigation Flow

The navigation structure is the primary enforcement point for role separation. It uses a `RootNavigator` that conditionally renders the appropriate stack based on the user's role and authentication status.

- **RootNavigator**: Checks `isAuthenticated` and `userRole`.
  - If `!isAuthenticated` -> Render **AuthStack**
  - If `userRole === 'FARMER'` -> Render **FarmerStack**
  - If `userRole === 'DELIVERY'` -> Render **DeliveryStack**

This ensures a Delivery user literally cannot define routes to Farmer screens, and vice-versa, preventing accidental access and simplifying deep linking logic.

### 2. Feature Isolation

Code for specific roles lives in `src/features/farmer` and `src/features/delivery`. Shared functionality (like Profile or Settings) lives in `src/features/shared` or is composed of reusable `components/`.

### 3. State Management

We use **Zustand** for lightweight global state (User Session, Theme).
For complex data caching and server state synchronization, we use **React Query (TanStack Query)**. This separates "UI State" from "Server State".

## Tech Stack Recommendation

- **Framework**: Expo (Managed Workflow) for rapid development and OTA updates.
- **Language**: TypeScript (Strict Mode).
- **Navigation**: React Navigation v6/v7.
- **Styling**: NativeWind (Tailwind CSS for React Native) for consistent styling.
- **State**: Zustand + React Query.
- **Forms**: React Hook Form + Zod validation.

## Implementation Plan

1.  Initialize Expo project with TypeScript.
2.  Install NativeWind and Navigation dependencies.
3.  Create the folder structure.
4.  Implement `useAuth` hook and Navigation setup.
