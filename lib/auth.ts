import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

type EmailPasswordPayload = {
  email: string;
  password: string;
};

type SignUpPayload = EmailPasswordPayload & {
  /** Display name. Forwarded into raw_user_meta_data so the
   *  on_auth_user_created trigger can derive name + initials. */
  name: string;
};

type AuthResult = {
  session: Session | null;
};

/**
 * Email/password sign-in. Throws on Supabase error so callers can
 * funnel everything through a single try/catch in the screen layer.
 */
export async function signInWithEmail(
  payload: EmailPasswordPayload
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) throw new Error(error.message);
  return { session: data?.session ?? null };
}

/**
 * Email/password sign-up. The `name` lands in user metadata where the
 * on_auth_user_created trigger reads it; this is also where Apple's
 * full-name payload will flow once Apple Sign-In ships.
 */
export async function signUpWithEmail(
  payload: SignUpPayload
): Promise<AuthResult> {
  const { email, password, name } = payload;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
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
