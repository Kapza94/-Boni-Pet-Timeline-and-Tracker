import { Redirect } from 'expo-router';
import { useSession } from '../hooks/useSession';

/**
 * Root router. Routes based on session state:
 *
 *   loading  → render nothing (the boot splash stays up)
 *   no session → sign-in
 *   signed in, no onboarded_at → onboarding step 1
 *   signed in, onboarded → main app tabs
 */
export default function Index() {
  const { isLoading, isSignedIn, user } = useSession();

  if (isLoading) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;
  if (!user?.onboarded_at) return <Redirect href="/(onboarding)/step-1-splash" />;
  return <Redirect href="/(app)/(tabs)" />;
}
