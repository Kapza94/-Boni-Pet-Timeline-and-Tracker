import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

type OtpResult = {
  session: Session | null;
};

/**
 * requestEmailOtp — kicks off the passwordless email flow: Supabase
 * sends a 6-digit code (and a magic link, which we ignore on iOS) to
 * the address. shouldCreateUser=true means a brand-new email is
 * auto-provisioned, so sign-up + sign-in collapse into one path.
 */
export async function requestEmailOtp(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw new Error(error.message);
}

/**
 * verifyEmailOtp — exchanges the 6-digit code for a session. On
 * success, on_auth_user_created has already (or will, for new
 * accounts) provisioned the household + public.users row.
 */
export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<OtpResult> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw new Error(error.message);
  return { session: data?.session ?? null };
}

/** Sign the current user out (clears the persisted session). */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/** Read the currently-persisted session, or null when signed out. */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}
