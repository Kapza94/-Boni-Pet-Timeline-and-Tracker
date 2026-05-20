import { Redirect } from 'expo-router';

// Temporary: until F02 (auth) lands, route straight into the scaffold demo.
// Once auth ships, switch this to check session and route to
// /(auth)/sign-in or /(onboarding)/splash.
export default function Index() {
  return <Redirect href="/scaffold" />;
}
