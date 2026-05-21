jest.mock('./supabase', () => {
  const signInWithPassword = jest.fn();
  const signUp = jest.fn();
  const signOut = jest.fn();
  const getSession = jest.fn();
  return {
    supabase: {
      auth: { signInWithPassword, signUp, signOut, getSession },
    },
  };
});

import { supabase } from './supabase';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getSession,
} from './auth';

const mocked = supabase.auth as unknown as {
  signInWithPassword: jest.Mock;
  signUp: jest.Mock;
  signOut: jest.Mock;
  getSession: jest.Mock;
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('signInWithEmail', () => {
  it('passes email + password to supabase and returns the session', async () => {
    mocked.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'u1' }, session: { access_token: 'tok' } },
      error: null,
    });
    const result = await signInWithEmail({
      email: 'a@b.com',
      password: 'hunter22',
    });
    expect(mocked.signInWithPassword).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'hunter22',
    });
    expect(result.session).toEqual({ access_token: 'tok' });
  });

  it('throws when supabase reports an error', async () => {
    mocked.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    await expect(
      signInWithEmail({ email: 'a@b.com', password: 'wrong' })
    ).rejects.toThrow('Invalid login credentials');
  });
});

describe('signUpWithEmail', () => {
  it('forwards name into raw_user_meta_data so the auth trigger can pick it up', async () => {
    mocked.signUp.mockResolvedValue({
      data: { user: { id: 'u2' }, session: { access_token: 'tok' } },
      error: null,
    });
    await signUpWithEmail({
      email: 'a@b.com',
      password: 'hunter22',
      name: 'Mochi',
    });
    expect(mocked.signUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'hunter22',
      options: { data: { name: 'Mochi' } },
    });
  });

  it('throws when supabase reports an error', async () => {
    mocked.signUp.mockResolvedValue({
      data: null,
      error: { message: 'User already registered' },
    });
    await expect(
      signUpWithEmail({ email: 'a@b.com', password: 'hunter22', name: 'M' })
    ).rejects.toThrow('User already registered');
  });
});

describe('signOut', () => {
  it('calls supabase.auth.signOut and ignores undefined response', async () => {
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
      data: { session: { access_token: 'tok', user: { id: 'u1' } } },
      error: null,
    });
    const session = await getSession();
    expect(session?.access_token).toBe('tok');
  });
});
