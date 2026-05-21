import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type HouseholdRow = {
  id: string;
  name: string | null;
  subscription_tier: 'free' | 'weekly' | 'monthly' | 'yearly';
  subscription_status:
    | 'active'
    | 'trialing'
    | 'expired'
    | 'canceled'
    | 'stubbed';
};

type UserRow = {
  id: string;
  household_id: string;
  name: string | null;
  role: 'primary' | 'partner' | 'housemate' | 'walker' | 'other';
  email: string | null;
  onboarded_at: string | null;
};

type SessionPayload = {
  session: Session | null;
  user: UserRow | null;
  household: HouseholdRow | null;
};

const SESSION_QUERY_KEY = ['session'] as const;

async function fetchSession(): Promise<SessionPayload> {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) return { session: null, user: null, household: null };

  // Profile fetch is best-effort. The auth session alone is enough to
  // mark the user as signed-in; the index router falls back to the
  // onboarding splash whenever onboarded_at is missing, which covers
  // the moments right after sign-up when the trigger may not have
  // committed yet or RLS hasn't propagated.
  const { data, error } = await supabase
    .from('users')
    .select(
      'id, household_id, name, role, email, onboarded_at, households(id, name, subscription_tier, subscription_status)'
    )
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !data) {
    if (error && __DEV__) {
      console.warn('[useSession] profile fetch failed:', error.message);
    }
    return { session, user: null, household: null };
  }

  const { households, ...userFields } = data as UserRow & {
    households: HouseholdRow | null;
  };
  return { session, user: userFields, household: households };
}

/**
 * useSession — single source of truth for "who is signed in and what
 * household are they in." Subscribes to supabase auth state changes
 * and invalidates the query on every transition so a sign-in / sign-out
 * propagates throughout the app via TanStack Query.
 *
 * `isSignedIn` reflects the auth session only — the profile join is
 * best-effort, so a slow trigger or a transient RLS hiccup doesn't
 * bounce a freshly-signed-in user back to the sign-in screen.
 */
export function useSession() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
  });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    isLoading: query.isLoading,
    isSignedIn: !!query.data?.session,
    session: query.data?.session ?? null,
    user: query.data?.user ?? null,
    household: query.data?.household ?? null,
  };
}
