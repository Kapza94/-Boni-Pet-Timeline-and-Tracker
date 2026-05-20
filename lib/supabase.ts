import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Don't crash the boot — F00 should still render the scaffold without
  // a live Supabase. Callers that touch supabase will fail loudly when
  // they attempt their first query, which is the right time to surface it.
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY missing — ' +
      'auth + data calls will fail. See .env.example.'
  );
}

export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'anon', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
