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
  session: Session;
  user: UserRow;
  household: HouseholdRow;
};

const SESSION_QUERY_KEY = ['session'] as const;

async function fetchSession(): Promise<SessionPayload | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) return null;

  const { data, error } = await supabase
    .from('users')
    .select(
      'id, household_id, name, role, email, onboarded_at, households(id, name, subscription_tier, subscription_status)'
    )
    .eq('id', session.user.id)
    .single();

  if (error || !data) return null;

  const { households, ...userFields } = data as UserRow & {
    households: HouseholdRow;
  };
  return { session, user: userFields, household: households };
}

/**
 * useSession — single source of truth for "who is signed in and what
 * household are they in." Subscribes to supabase auth state changes
 * and invalidates the query on every transition so a sign-in / sign-out
 * propagates throughout the app via TanStack Query.
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
    isSignedIn: !!query.data,
    session: query.data?.session ?? null,
    user: query.data?.user ?? null,
    household: query.data?.household ?? null,
  };
}
