import { ReactNode } from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../lib/supabase', () => {
  const getSession = jest.fn();
  const onAuthStateChange = jest.fn();
  const from = jest.fn();
  return {
    supabase: {
      auth: { getSession, onAuthStateChange },
      from,
    },
  };
});

import { supabase } from '../lib/supabase';
import { useSession } from './useSession';

const mocked = supabase as unknown as {
  auth: {
    getSession: jest.Mock;
    onAuthStateChange: jest.Mock;
  };
  from: jest.Mock;
};

function wrap() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

function mockUserRow(row: Record<string, unknown> | null, error: unknown = null) {
  const maybeSingle = jest.fn().mockResolvedValue({ data: row, error });
  const eq = jest.fn(() => ({ maybeSingle }));
  const select = jest.fn(() => ({ eq }));
  return { maybeSingle, eq, select };
}

beforeEach(() => {
  jest.clearAllMocks();
  mocked.auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  });
});

describe('useSession', () => {
  it('returns isSignedIn=false when there is no active session', async () => {
    mocked.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    const { result } = renderHook(() => useSession(), { wrapper: wrap() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('returns user + household when signed in', async () => {
    mocked.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: 't',
          user: { id: 'u1', email: 'a@b.com' },
        },
      },
      error: null,
    });
    mocked.from.mockReturnValue(
      mockUserRow({
        id: 'u1',
        household_id: 'h1',
        name: 'Mochi',
        role: 'primary',
        email: 'a@b.com',
        households: {
          id: 'h1',
          name: 'Mochi household',
          subscription_tier: 'free',
          subscription_status: 'active',
        },
      })
    );

    const { result } = renderHook(() => useSession(), { wrapper: wrap() });

    await waitFor(() => expect(result.current.isSignedIn).toBe(true));
    expect(result.current.user?.name).toBe('Mochi');
    expect(result.current.household?.subscription_tier).toBe('free');
  });

  it('keeps isSignedIn=true when the auth session exists but the profile fetch fails', async () => {
    mocked.auth.getSession.mockResolvedValue({
      data: {
        session: { access_token: 't', user: { id: 'u1', email: 'a@b.com' } },
      },
      error: null,
    });
    mocked.from.mockReturnValue(mockUserRow(null, { message: 'RLS error' }));
    const { result } = renderHook(() => useSession(), { wrapper: wrap() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.household).toBeNull();
  });

  it('subscribes to auth state changes so a sign-in/out refreshes the query', async () => {
    mocked.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    const unsubscribe = jest.fn();
    mocked.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe } },
    });

    const { unmount } = renderHook(() => useSession(), { wrapper: wrap() });
    await act(async () => {
      // allow effects to flush
    });
    expect(mocked.auth.onAuthStateChange).toHaveBeenCalledTimes(1);
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
