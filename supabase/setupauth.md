# Supabase Authentication Integration Guide

> Complete walkthrough of integrating Supabase Auth into Linkzzzz, including OAuth, email/password flows, and the profile persistence fix.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Initial Setup](#phase-1-initial-setup)
4. [Phase 2: Auth Modal Integration](#phase-2-auth-modal-integration)
5. [Phase 3: Auth State Management](#phase-3-auth-state-management)
6. [Phase 4: Route Protection](#phase-4-route-protection)
7. [Phase 5: OAuth Profile Persistence Fix](#phase-5-oauth-profile-persistence-fix)
8. [Files Changed](#files-changed)
9. [Testing Checklist](#testing-checklist)

---

## Overview

### Auth Flows Implemented

| Flow | Method | Provider |
|------|--------|----------|
| Google OAuth | `signInWithOAuth` | Google |
| GitHub OAuth | `signInWithOAuth` | GitHub |
| Email Sign Up | `signUp` | Email |
| Email Sign In | `signInWithPassword` | Email |
| Forgot Password | `resetPasswordForEmail` | Email |
| Sign Out | `signOut` | All |

---

## Prerequisites

### Supabase Dashboard Setup

1. **Create Project** at [supabase.com](https://supabase.com)
2. **Enable Auth Providers**:
   - Go to Authentication → Providers
   - Enable **Google** (requires OAuth credentials from Google Cloud Console)
   - Enable **GitHub** (requires OAuth App from GitHub Developer Settings)
3. **Configure Redirect URLs**:
   - Add `http://localhost:5173/auth/callback` to allowed redirect URLs
   - Add production URL when deploying

### Environment Variables

```env
# frontend/.env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Phase 1: Initial Setup

### 1.1 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 1.2 Create Supabase Client

**File:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Phase 2: Auth Modal Integration

### 2.1 OAuth Login (Google/GitHub)

Replaced placeholder `setTimeout` logic with actual Supabase OAuth:

```typescript
const handleOAuthLogin = async (provider: 'google' | 'github') => {
  setIsLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  } catch (error: any) {
    toast.error(error.message || 'OAuth login failed');
    setIsLoading(false);
  }
};
```

### 2.2 Email/Password Sign Up

```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: name }
  }
});
if (error) throw error;
toast.success('Check your email for the confirmation link!');
```

### 2.3 Email/Password Sign In

```typescript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password
});
if (error) throw error;
toast.success('Signed in successfully!');
navigate('/dashboard');
```

### 2.4 Forgot Password

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
});
if (error) throw error;
toast.success('Password reset link sent to your email!');
```

---

## Phase 3: Auth State Management

### 3.1 Create useAuth Hook

**File:** `src/hooks/useAuth.ts`

This hook provides:
- Current user state
- Session management
- Auth state change listener
- Route protection
- Sign out function

```typescript
export const useAuth = (requireAuth: boolean = false) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
      });
      if (requireAuth && !session) navigate('/');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({ user: session?.user ?? null, session, isLoading: false });
        if (event === 'SIGNED_OUT' && requireAuth) navigate('/');
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...authState, signOut };
};
```

---

## Phase 4: Route Protection

### 4.1 Auth Callback Page

**File:** `src/pages/AuthCallback.tsx`

Handles OAuth redirects:

```typescript
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      navigate(session ? '/dashboard' : '/');
    };
    handleAuthCallback();
  }, [navigate]);

  return <Loader />;
};
```

### 4.2 Protected Routes

Dashboard and Settings use `useAuth(true)` to require authentication:

```typescript
const { user, isLoading, signOut } = useAuth(true); // requireAuth = true
```

---

## Phase 5: OAuth Profile Persistence Fix

### The Problem

When users sign in with OAuth (Google/GitHub), Supabase overwrites `user_metadata` on every login. This means:
- User updates display name → Saves to `user_metadata`
- User signs out and back in → OAuth provider data overwrites custom name
- Display name resets to OAuth provider's default

### The Solution

Create a separate `profiles` table that OAuth cannot overwrite.

### 5.1 Create Profiles Table

**File:** `supabase/setup_profiles_table.sql`

Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5.2 Create Profiles API

**File:** `src/lib/profiles.ts`

```typescript
export const getProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error?.code === 'PGRST116') {
    // Profile doesn't exist, create one
    return await createProfile(user.id, { ... });
  }

  return data;
};

export const updateProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser();
  return await supabase.from('profiles').update(updates).eq('id', user.id);
};
```

### 5.3 Update Settings Page

**Before:** Reads/writes from `user_metadata` (gets overwritten by OAuth)
```typescript
// Old approach - data gets overwritten on OAuth login
await supabase.auth.updateUser({ data: { full_name: displayName } });
```

**After:** Reads/writes from `profiles` table (persists across logins)
```typescript
// New approach - data persists across OAuth logins
await updateProfile({ display_name: displayName });
```

### 5.4 Update Dashboard

Dashboard now reads display name from profiles table:

```typescript
const userDisplayName = profile?.display_name 
  || user?.user_metadata?.full_name 
  || user?.email?.split('@')[0] 
  || 'User';
```

---

## Files Changed

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client initialization |
| `src/lib/profiles.ts` | Profiles table API helpers |
| `src/hooks/useAuth.ts` | Auth state management hook |
| `src/pages/AuthCallback.tsx` | OAuth redirect handler |
| `src/components/AuthModal.tsx` | Auth UI with Supabase calls |
| `src/pages/Dashboard.tsx` | Protected page with profile data |
| `src/pages/Settings.tsx` | Profile editing with persistence |
| `src/App.tsx` | Added `/auth/callback` route |
| `supabase/setup_profiles_table.sql` | Database schema |

---

## Testing Checklist

### Auth Flows
- [ ] Google OAuth → Redirects to dashboard
- [ ] GitHub OAuth → Redirects to dashboard
- [ ] Email Sign Up → Shows confirmation message
- [ ] Email Sign In → Redirects to dashboard
- [ ] Forgot Password → Sends reset email
- [ ] Sign Out → Redirects to landing page

### Profile Persistence
- [ ] Change display name in Settings
- [ ] Sign out
- [ ] Sign back in with OAuth
- [ ] Verify display name persists (not reset to OAuth default)

### Route Protection
- [ ] Navigate to `/dashboard` while logged out → Redirects to `/`
- [ ] Navigate to `/settings` while logged out → Redirects to `/`

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
├─────────────────────────────────────────────────────────────┤
│  AuthModal.tsx          useAuth.ts          Dashboard.tsx    │
│  ┌─────────────┐       ┌───────────┐       ┌─────────────┐  │
│  │ OAuth/Email │──────▶│ Auth Hook │◀──────│  Protected  │  │
│  │   Buttons   │       │  (state)  │       │    Pages    │  │
│  └─────────────┘       └─────┬─────┘       └─────────────┘  │
│                              │                               │
│  Settings.tsx                │           profiles.ts         │
│  ┌─────────────┐             │          ┌─────────────┐     │
│  │   Profile   │─────────────┼─────────▶│  Profiles   │     │
│  │   Editor    │             │          │     API     │     │
│  └─────────────┘             │          └──────┬──────┘     │
└──────────────────────────────┼─────────────────┼────────────┘
                               │                 │
┌──────────────────────────────┼─────────────────┼────────────┐
│                         Supabase                             │
├──────────────────────────────┼─────────────────┼────────────┤
│                              ▼                 ▼             │
│  ┌─────────────────────┐   ┌─────────────────────┐          │
│  │     auth.users      │   │   public.profiles   │          │
│  │  (OAuth overwrites) │   │ (user-owned, safe)  │          │
│  └─────────────────────┘   └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

*Documentation created for Linkzzzz - February 2026*
