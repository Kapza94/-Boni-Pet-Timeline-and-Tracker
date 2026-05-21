import { useCallback, useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '../lib/supabase';

type SignInState = 'idle' | 'in-flight' | 'success' | 'error' | 'cancelled';

/**
 * useGoogleSignIn — wraps expo-auth-session's Google provider so the
 * sign-in screen only sees `{ promptGoogleSignIn, isReady, status,
 * errorMessage }`. The hook:
 *
 *   1. Builds the native iOS auth request bound to our iOS OAuth
 *      client. Requires a dev build (or production / TestFlight) —
 *      Expo Go can't honor the reversed-client-id URL scheme.
 *   2. Waits for the response (`success` | `cancel` | `error`).
 *   3. On success, hands the returned id_token to Supabase via
 *      signInWithIdToken so the same session lifecycle as the email
 *      path takes over and on_auth_user_created provisions the
 *      household + user rows.
 */
export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const [status, setStatus] = useState<SignInState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const idToken = response.params?.id_token;
      if (!idToken) {
        setStatus('error');
        setErrorMessage('Google returned no ID token.');
        return;
      }
      (async () => {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });
        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }
        setStatus('success');
      })();
      return;
    }
    if (response.type === 'cancel' || response.type === 'dismiss') {
      setStatus('cancelled');
      return;
    }
    if (response.type === 'error') {
      setStatus('error');
      setErrorMessage(response.error?.message ?? 'Google sign-in failed.');
    }
  }, [response]);

  const promptGoogleSignIn = useCallback(async () => {
    setErrorMessage(null);
    setStatus('in-flight');
    await promptAsync();
  }, [promptAsync]);

  return {
    isReady: !!request,
    status,
    errorMessage,
    promptGoogleSignIn,
  };
}
