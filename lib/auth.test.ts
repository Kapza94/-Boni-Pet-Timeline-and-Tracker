jest.mock('./supabase', () => {
  const signInWithOtp = jest.fn();
  const verifyOtp = jest.fn();
  const signOut = jest.fn();
  const getSession = jest.fn();
  return {
    supabase: {
      auth: { signInWithOtp, verifyOtp, signOut, getSession },
    },
  };
});

import { supabase } from './supabase';
import { requestEmailOtp, verifyEmailOtp, signOut, getSession } from './auth';

const mocked = supabase.auth as unknown as {
  signInWithOtp: jest.Mock;
  verifyOtp: jest.Mock;
  signOut: jest.Mock;
  getSession: jest.Mock;
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('requestEmailOtp', () => {
  it('asks Supabase to send a code, auto-creating the user when needed', async () => {
    mocked.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    await requestEmailOtp('a@b.com');
    expect(mocked.signInWithOtp).toHaveBeenCalledWith({
      email: 'a@b.com',
      options: { shouldCreateUser: true },
    });
  });

  it('throws when Supabase reports an error', async () => {
    mocked.signInWithOtp.mockResolvedValue({
      data: null,
      error: { message: 'Email rate limit exceeded' },
    });
    await expect(requestEmailOtp('a@b.com')).rejects.toThrow(
      'Email rate limit exceeded'
    );
  });
});

describe('verifyEmailOtp', () => {
  it('verifies the 6-digit code and returns the session', async () => {
    mocked.verifyOtp.mockResolvedValue({
      data: { session: { access_token: 't' } },
      error: null,
    });
    const result = await verifyEmailOtp('a@b.com', '123456');
    expect(mocked.verifyOtp).toHaveBeenCalledWith({
      email: 'a@b.com',
      token: '123456',
      type: 'email',
    });
    expect(result.session?.access_token).toBe('t');
  });

  it('throws when the code is wrong or expired', async () => {
    mocked.verifyOtp.mockResolvedValue({
      data: null,
      error: { message: 'Token has expired or is invalid' },
    });
    await expect(verifyEmailOtp('a@b.com', '000000')).rejects.toThrow(
      'Token has expired or is invalid'
    );
  });
});

describe('signOut', () => {
  it('calls supabase.auth.signOut', async () => {
    mocked.signOut.mockResolvedValue({ error: null });
    await signOut();
    expect(mocked.signOut).toHaveBeenCalledTimes(1);
  });

  it('throws when sign-out fails', async () => {
    mocked.signOut.mockResolvedValue({ error: { message: 'no network' } });
    await expect(signOut()).rejects.toThrow('no network');
  });
});

describe('getSession', () => {
  it('returns null when there is no active session', async () => {
    mocked.getSession.mockResolvedValue({ data: { session: null }, error: null });
    expect(await getSession()).toBeNull();
  });

  it('returns the session object when present', async () => {
    mocked.getSession.mockResolvedValue({
      data: { session: { access_token: 't', user: { id: 'u1' } } },
      error: null,
    });
    const session = await getSession();
    expect(session?.access_token).toBe('t');
  });
});
