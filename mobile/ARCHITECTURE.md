# FarminGo App Architecture & Implementation Overview

## 1. App Architecture
FarminGo is built using **React Native (Expo)** with a focus on high performance and modularity.
- **Frontend**: React Native, NativeWind (Tailwind CSS), Zustand (State Management), React Navigation.
- **Backend**: Node.js, Express, MongoDB, Socket.io (Real-time tracking).
- **Communication**: REST API for transactional data, WebSockets for live delivery updates.

## 2. Data Models
### User
- `id`, `username`, `password`, `role` (CUSTOMER, FARMER, DELIVERY, ADMIN).
### Product
- `id`, `name`, `price`, `category`, `image`, `farmerId` (Ownership).
### Order
- `id`, `customerId`, `farmerId`, `items`, `status` (pending, assigned, delivered), `totalAmount`, `deliveryLocation`.

## 3. Role-Based Navigation Logic
The app uses a conditional root navigator based on the `userRole` state from `AuthContext`.
- **Unauthorized**: `AuthStack` (Login/Register/Splash).
- **Customer**: `CustomerTabStack` (Home/Browse, Cart, Category, My Orders).
- **Farmer**: `FarmerTabStack` (Dashboard/Sales, Inventory, Orders).
- **Delivery**: `DeliveryStack` (Online/Offline, Task List, Active Map).

## 4. Location Handling Flow (Priority Implementation)
Location is handled by a centralized `useLocationStore` (Zustand).
1. **Trigger**: Location is requested instantly upon successful login.
2. **Permission**: Requests `foregroundPermissions`.
3. **Caching**: Coordinates are stored in the state for immediate access across screens.
4. **Fallback**: If permission is denied or fails, it defaults to pre-defined coordinates (e.g., Pune center) to ensure the UI never blocks.
5. **Efficiency**: Reverse geocoding (address lookup) is performed once and cached.

## 5. Performance Optimization Approach
- **Instant Login**: User role and basic profile are cached in `AsyncStorage`.
- **Skeleton Loaders**: Premium designs use loading states to prevent "jumping" UI.
- **Asset Optimization**: High-quality imagery from Unsplash with specific width parameters for faster loading.
- **Tailwind Pre-compilation**: NativeWind ensures styling logic happens before runtime where possible.
- **Safe Parsing**: All JSON parsing from external storage or network is wrapped in try-catch with graceful fallbacks.

## 6. Real-time Order Flow
- **Customer**: Creates order -> Emits via REST -> Notifies Farmer.
- **Farmer**: Receives "Pending" order in Dashboard -> Prepares.
- **Delivery**: "Pending" orders appear in list -> Accept -> Status changes to "Assigned" -> Notifies Customer/Farmer via Socket.io.
- **Completion**: Mark as "Delivered" -> Moves to history -> Triggers earnings update for Farmer and Partner.
