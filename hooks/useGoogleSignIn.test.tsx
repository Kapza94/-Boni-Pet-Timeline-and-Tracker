import { renderHook, act, waitFor } from '@testing-library/react-native';

const mockPromptAsync = jest.fn();
const mockUseAuthRequest = jest.fn();

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: (...args: unknown[]) => mockUseAuthRequest(...args),
}));

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithIdToken: jest.fn(),
    },
  },
}));

import { supabase } from '../lib/supabase';
import { useGoogleSignIn } from './useGoogleSignIn';

const signInWithIdToken = supabase.auth.signInWithIdToken as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID = 'test-ios-client.apps.googleusercontent.com';
});

describe('useGoogleSignIn', () => {
  it('configures useAuthRequest with the iOS client ID from env', () => {
    mockUseAuthRequest.mockReturnValue([{ /* request */ }, null, mockPromptAsync]);
    renderHook(() => useGoogleSignIn());
    expect(mockUseAuthRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        iosClientId: 'test-ios-client.apps.googleusercontent.com',
      })
    );
  });

  it('returns isReady=true once useAuthRequest has produced a request', () => {
    mockUseAuthRequest.mockReturnValue([{ request: 'r' }, null, mockPromptAsync]);
    const { result } = renderHook(() => useGoogleSignIn());
    expect(result.current.isReady).toBe(true);
  });

  it('returns isReady=false when the request is null (still warming up)', () => {
    mockUseAuthRequest.mockReturnValue([null, null, mockPromptAsync]);
    const { result } = renderHook(() => useGoogleSignIn());
    expect(result.current.isReady).toBe(false);
  });

  it('promptGoogleSignIn delegates to expo-auth-session mockPromptAsync', async () => {
    mockUseAuthRequest.mockReturnValue([{ request: 'r' }, null, mockPromptAsync]);
    mockPromptAsync.mockResolvedValue({ type: 'cancel' });
    const { result } = renderHook(() => useGoogleSignIn());
    await act(async () => {
      await result.current.promptGoogleSignIn();
    });
    expect(mockPromptAsync).toHaveBeenCalledTimes(1);
  });

  it('on success, exchanges the ID token via supabase signInWithIdToken', async () => {
    let onResponse: ((response: unknown) => void) | null = null;
    mockUseAuthRequest.mockImplementation(() => {
      // simulate the hook re-rendering when a response arrives
      return [{ request: 'r' }, null, mockPromptAsync];
    });

    signInWithIdToken.mockResolvedValue({
      data: { session: { access_token: 't' } },
      error: null,
    });

    const { result, rerender } = renderHook(() => useGoogleSignIn());

    // simulate Google returning an id_token in the response
    mockUseAuthRequest.mockReturnValue([
      { request: 'r' },
      {
        type: 'success',
        authentication: null,
        params: { id_token: 'google-id-token' },
      },
      mockPromptAsync,
    ]);
    rerender();

    await waitFor(() =>
      expect(signInWithIdToken).toHaveBeenCalledWith({
        provider: 'google',
        token: 'google-id-token',
      })
    );

    // silence the unused setter — keeps the file lint-clean
    void onResponse;
  });
});
