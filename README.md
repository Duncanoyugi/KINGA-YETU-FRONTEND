# ImmuniTrack Kenya - Frontend Application

## Overview

The ImmuniTrack Kenya frontend is a React-based web application designed to track child immunizations across Kenya. It provides role-based dashboards and features for different user types: Parents, Health Workers, and Administrators.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Redux Toolkit + RTK Query | State Management & Data Fetching |
| React Router v6 | Navigation & Routing |
| Tailwind CSS | Styling |
| React Query | Server State Management |
| Axios | HTTP Client |
| Heroicons/Lucide React | Icons |
| Framer Motion | Animations |

## Project Structure

```
frontend/src/
├── app/                    # App-level configuration
│   ├── providers/          # Context providers (Auth, Query, Theme)
│   └── store/              # Redux store configuration
├── components/             # Reusable UI components
│   ├── common/             # Generic components (Button, Input, Modal, etc.)
│   ├── layout/             # Layout components (AdminDashboardLayout, etc.)
│   ├── widgets/            # Dashboard widgets
│   └── charts/             # Chart components
├── config/                 # Configuration files
├── features/               # Feature modules (organized by domain)
│   ├── auth/               # Authentication feature
│   ├── children/           # Child management feature
│   ├── vaccines/           # Vaccine management feature
│   ├── analytics/          # Analytics feature
│   ├── notifications/      # Notifications feature
│   ├── reports/            # Reports feature
│   └── ...
├── hooks/                  # Custom React hooks
├── lib/                    # Library utilities
├── pages/                  # Page components
├── routing/                # Routing configuration
├── services/               # API and storage services
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Core Concepts

### 1. Application Entry Point

The application starts in `main.tsx`, which renders the `App` component. The main app setup is in `app/app.tsx` (referenced in main.tsx), which wraps the application with several providers:

```tsx
// Providers are applied in this order:
<QueryProvider>           // React Query for server state
  <AuthProvider>          // Authentication context
    <ThemeProvider>       // Dark/Light theme
      <AppRouter />       // Main routing
```

### 2. State Management

The application uses two types of state management:

#### Redux Toolkit (Client State)
- Manages authentication state, UI state, and cached data
- Uses "slices" for each feature domain
- Located in `app/store/store.ts`

#### RTK Query (Server State)
- Manages API data fetching, caching, and mutations
- Each feature has its own API definition (e.g., `childrenAPI`, `vaccinesAPI`)
- Provides automatic caching, optimistic updates, and polling

**Redux Store Structure:**
```typescript
{
  auth: AuthState,           // User, token, loading state
  children: ChildrenState,   // Children list, current child
  vaccines: VaccinesState,   // Vaccines, inventory
  parents: ParentsState,     // Parent profiles
  reminders: RemindersState, // Reminder management
  reports: ReportsState,     // Report data
  analytics: AnalyticsState, // Analytics data
  notifications: NotifState, // Notifications
  facilities: FacilitiesState,
  schedules: SchedulesState,
  // Plus RTK Query API slices
}
```

### 3. Authentication Flow

Authentication is handled through a multi-layer system:

#### AuthProvider (`app/providers/AuthProvider.tsx`)
- React Context that provides authentication state to all components
- Manages user login, logout, and session persistence
- Checks for existing token on app load and refreshes user data

#### Auth Slice (`features/auth/authSlice.ts`)
- Redux slice managing authentication state
- Stores user object, JWT token, loading state, and error state
- Persists token to localStorage

#### Auth API (`features/auth/authAPI.ts`)
- RTK Query API for authentication endpoints
- Provides hooks: `useLoginMutation`, `useLogoutMutation`, `useGetCurrentUserQuery`

#### useAuth Hook (`hooks/useAuth.ts`)
- Main hook for authentication in components
- Provides: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `hasRole()`

**Login Flow:**
1. User enters credentials on Login page
2. `useAuth().login()` called with email/password
3. Auth API calls backend `/auth/login` endpoint
4. On success: token stored in localStorage, user data stored in Redux
5. User redirected to role-based dashboard

### 4. API Communication

#### Axios Instance (`services/api/axiosInstance.ts`)
- Configured with base URL, timeout, and headers
- Request interceptor adds JWT token to Authorization header
- Response interceptor handles errors and token refresh

#### API Endpoints Configuration (`config/apiConfig.ts`)
- Centralized endpoint definitions
- All backend API routes defined as constants

#### Feature APIs
Each feature has its own API definition using RTK Query:

```typescript
// Example: childrenAPI
export const childrenAPI = createApi({
  reducerPath: 'childrenAPI',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/children` }),
  tagTypes: ['Children', 'Child', 'Growth'],
  endpoints: (builder) => ({
    getChildren: builder.query<Child[], void>({...}),
    getChildById: builder.query<Child, string>({...}),
    createChild: builder.mutation<Child, CreateChildRequest>({...}),
    // ... more endpoints
  })
});
```

### 5. Routing & Navigation

#### AppRouter (`routing/AppRouter.tsx`)
- Main routing configuration using React Router
- Defines all application routes
- Implements role-based access control

#### Routes (`routing/routes.ts`)
- Centralized route path constants
- All application paths defined here

#### ProtectedRoute (`routing/ProtectedRoute.tsx`)
- Guards routes requiring authentication
- Checks user roles and redirects accordingly
- Handles explicit logout state

**Route Structure:**
```
/                           → Landing Page (public)
/auth/login                 → Login Page
/auth/register              → Registration Page
/dashboard/parent/*         → Parent Dashboard (PARENT role)
/dashboard/health-worker/*  → Health Worker Dashboard (HEALTH_WORKER role)
/dashboard/admin/*          → Admin Dashboard (ADMIN/SUPER_ADMIN role)
/dashboard/*                → Generic dashboard (fallback)
```

### 6. Role-Based Dashboards

The application provides different dashboards based on user role:

#### Parent Dashboard (`Dashboard/ParentDashboard/ParentDashboard.tsx`)
- View linked children
- Track vaccination schedules
- View upcoming appointments
- Receive notifications and reminders
- Access growth tracking

#### Health Worker Dashboard (`Dashboard/HealthWorkerDashboard/HealthWorkerDashboard.tsx`)
- Register new children
- Record immunizations
- Manage appointments
- View facility statistics
- Track vaccine inventory

#### Admin Dashboard (`Dashboard/AdminDashboard/AdminDashboard.tsx`)
- User management
- Facility management
- System configuration
- Analytics and reports
- Audit logs

## Feature Modules

### Authentication (`features/auth/`)
- Login, registration, password reset
- JWT token management
- Role-based access control
- OTP verification support

### Children Management (`features/children/`)
- Child registration
- Growth tracking
- Development records
- Immunization history
- Vaccination schedules

### Vaccines (`features/vaccines/`)
- Vaccine catalog management
- Inventory tracking
- Batch tracking
- Stock alerts
- Usage statistics

### Analytics (`features/analytics/`)
- Dashboard metrics
- Coverage analytics
- Dropout analysis
- Performance metrics
- Geographic visualization

### Notifications (`features/notifications/`)
- Email notifications
- SMS notifications
- Push notifications
- Notification preferences

### Reports (`features/reports/`)
- Coverage reports
- Missed vaccines reports
- Facility performance reports
- Report generation and export

### Reminders (`features/reminders/`)
- Vaccination reminders
- Appointment reminders
- Custom reminder scheduling

## Custom Hooks

The application provides several custom hooks for common functionality:

| Hook | Purpose |
|------|---------|
| `useAuth` | Authentication state and methods |
| `useChildren` | Child management operations |
| `useVaccines` | Vaccine operations |
| `useNotifications` | Notification management |
| `usePermissions` | Role-based permission checking |
| `useToast` | Toast notification display |
| `useDebounce` | Debounce value changes |
| `useLocalStorage` | LocalStorage persistence |
| `useWebSocket` | Real-time WebSocket communication |

## UI Components

### Common Components (`components/common/`)
- Button, Input, Select
- Modal, Dialog
- Table, Pagination
- Spinner, Loader
- Toast notifications
- Theme toggle
- Tabs, Timeline

### Layout Components (`components/layout/`)
- AdminDashboardLayout
- ParentDashboardLayout
- RoleBasedLayout
- AuthLayout

### Widgets (`components/widgets/`)
- CoverageMap
- RecentActivities
- UpcomingVaccinations
- StatsCard
- ActivityChart
- AlertsWidget

## Data Flow Example: Registering a Child

1. **User navigates** to Add Child page
2. **User fills form** with child details
3. **Form validation** runs using validation schemas
4. **API call** made via `createChildMutation`
5. **Backend validates** and creates child record
6. **Cache invalidation** triggers - children list refreshes
7. **Success toast** displayed
8. **User redirected** to child profile or children list

## Environment Configuration

Key environment variables (in `.env`):

```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=ImmuniTrack Kenya
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

## Development Workflow

### Running the Application
```bash
cd frontend
npm install
npm run dev
```

### Key Development Patterns

1. **Feature-Based Organization**: Each feature (children, vaccines, etc.) has its own folder with API, hooks, slice, and types

2. **RTK Query Usage**: Use generated hooks for data fetching instead of manual fetch calls

3. **Component Composition**: Build complex UIs from smaller, reusable components

4. **Type Safety**: Define TypeScript interfaces for all data structures

5. **Role-Based Access**: Always check user role before showing role-specific features

## Security Considerations

- JWT tokens stored in localStorage
- Token refresh handled automatically via axios interceptor
- Protected routes check authentication state
- Role-based route guards prevent unauthorized access
- API requests include authorization header

## Performance Optimizations

- RTK Query caching reduces redundant API calls
- Pagination for large data sets
- Lazy loading for routes
- Optimistic updates for mutations
- Debounced search inputs

---

## Parent-Children Logic Implementation

The parent-children relationship in ImmuniTrack is implemented through a multi-layered architecture that connects Parents to their Children through a linking system. Here's how it works:

### Data Model Relationship

```
User (PARENT role)
    ↓ (has one)
Parent Profile (id, userId, emergencyContact...)
    ↓ (links to)
Children (multiple per parent)
```

**Key Types:**

1. **Parent** (`features/parents/parentsTypes.ts`):
   ```typescript
   interface Parent {
     id: string;
     userId: string;           // Links to User account
     emergencyContact?: string;
     emergencyPhone?: string;
     user?: User;              // Associated user account
     children?: Child[];      // Linked children
   }
   ```

2. **Child** (`types/child.types.ts`):
   ```typescript
   interface Child {
     id: string;
     parentId: string;        // Foreign key to Parent
     firstName: string;
     lastName: string;
     dateOfBirth: string;
     gender: Gender;
     uniqueIdentifier: string; // Auto-generated
     // ... growth records, immunizations, schedules
   }
   ```

### Authentication Flow for Parents

When a user logs in with PARENT role:

1. **AuthProvider** (`app/providers/AuthProvider.tsx`) validates credentials
2. User object includes `parentProfile` with the parent's ID
3. The `useAuth()` hook provides access to `user.parentProfile.id`

```typescript
// In ParentDashboard.tsx
const parentId = user?.parentProfile?.id || '';
const { dashboard } = useParentDashboard(parentId);
```

### Core API Endpoints

The parent-children relationship is managed through these RTK Query endpoints:

#### Parents API (`features/parents/parentsAPI.ts`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `getParentByUserId` | GET | Get parent profile by user ID |
| `getParentChildren` | GET | Get all children linked to a parent |
| `linkChild` | POST | Link a child to a parent |
| `unlinkChild` | DELETE | Remove child link |
| `getParentDashboard` | GET | Get parent's dashboard data |

#### Children API (`features/children/childrenAPI.ts`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `getChildrenByParent` | GET | Get parent's children (`/my-children`) |
| `createChild` | POST | Register a new child |
| `getChildById` | GET | Get single child details |

### Implementation Layers

#### 1. Redux Slice (`features/parents/parentsSlice.ts`)
Manages client state:
```typescript
{
  parents: Parent[],
  currentParent: Parent | null,
  linkedChildren: Child[],   // Children linked to current parent
  reminders: Reminder[],
  isLoading: boolean,
  error: string | null
}
```

#### 2. API Layer (`features/parents/parentsAPI.ts`)
RTK Query definitions for all parent-related endpoints with automatic caching via tags.

#### 3. Hook Layer (`features/parents/parentsHooks.ts`)
Provides reusable functions:

```typescript
// Main hook for parents
export const useParents = () => {
  // CRUD operations for parents
  const createParent = ...
  const updateParentDetails = ...
  const deleteParent = ...
}

// Hook for parent dashboard
export const useParentDashboard = (parentId: string) => {
  // Returns: dashboard, stats, isLoading, refetch
}

// Hook for linking children
export const useLinkChild = () => {
  // linkChild(), unlinkChild()
}
```

### Flow: Registering a Child as a Parent

1. **User navigates** to `/dashboard/parent/children/add`
2. **AddChild page** renders form with fields:
   - First Name, Middle Name, Last Name
   - Date of Birth
   - Gender
   - Birth Certificate Number
   - Birth Facility
   - Birth Weight/Height
3. **Form submission** calls `useChildren().createChild(data)`
4. **Backend处理**:
   - Validates parent from JWT token
   - Creates Child record with `parentId` from authenticated user
   - Generates unique identifier
5. **On success**:
   - Redux state updated via cache invalidation
   - Child appears in parent's children list
   - User redirected to children list

### Flow: Viewing Parent Dashboard

1. **ParentDashboard** loads with `user.parentProfile.id`
2. **useParentDashboard(parentId)** hook fetches:
   - Parent profile
   - Linked children
   - Upcoming reminders
   - Vaccination stats (completed, missed)
3. **Dashboard displays**:
   - Children's vaccination completion rates
   - Upcoming vaccination reminders
   - Recent activities

### Flow: Linking Existing Child to Parent

For admin/health worker linking a child to parent:

1. **Admin** uses `linkChild` mutation
2. **Request includes**:
   ```typescript
   {
     parentId: string,
     childId: string,
     relationship: 'MOTHER' | 'FATHER' | 'GUARDIAN' | 'OTHER',
     isPrimary: boolean
   }
   ```
3. **Backend** creates ParentChildLink record
4. **Cache invalidated** - both parent and child queries refresh

### Key Files Reference

| File | Purpose |
|------|---------|
| `features/parents/parentsAPI.ts` | RTK Query API definitions |
| `features/parents/parentsHooks.ts` | React hooks for parent operations |
| `features/parents/parentsSlice.ts` | Redux state management |
| `features/parents/parentsTypes.ts` | TypeScript interfaces |
| `features/children/childrenAPI.ts` | Child-related API endpoints |
| `features/children/childrenHooks.ts` | Child management hooks |
| `features/children/childrenSlice.ts` | Child Redux state |
| `pages/children/AddChild.tsx` | Child registration form |
| `pages/children/ChildrenList.tsx` | Children list display |
| `Dashboard/ParentDashboard/ParentDashboard.tsx` | Parent dashboard view |

### Important Notes

1. **Parent ID Source**: For PARENT role users, the `parentId` is automatically derived from `user.parentProfile.id` - parents don't need to provide it manually.

2. **Multiple Children**: A parent can have multiple children linked to their profile.

3. **Caching**: The API uses RTK Query tags ('Children', 'Parent', 'Children') for automatic cache invalidation when relationships change.

4. **Security**: All endpoints require JWT authentication, and the backend validates that users can only access children linked to their parent profile.

## Summary

The ImmuniTrack frontend is a modern React application that provides a comprehensive interface for child immunization tracking. It uses Redux Toolkit for state management, RTK Query for efficient data fetching, and React Router for navigation. The application is organized around feature modules, with each feature having its own API, hooks, and state management. Role-based access control ensures users only see features appropriate to their role (Parent, Health Worker, or Administrator).
