import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('../../lib/auth', () => ({
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
}));

jest.mock('../../hooks/useGoogleSignIn', () => ({
  useGoogleSignIn: () => ({
    isReady: false,
    status: 'idle',
    errorMessage: null,
    promptGoogleSignIn: jest.fn(),
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

import { signInWithEmail, signUpWithEmail } from '../../lib/auth';
import SignIn from './sign-in';

const signIn = signInWithEmail as jest.Mock;
const signUp = signUpWithEmail as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignIn screen — email path', () => {
  it('reveals the email form when "Continue with email" is pressed', () => {
    const { queryByTestId, getByTestId } = render(<SignIn />);
    expect(queryByTestId('email-input')).toBeNull();
    fireEvent.press(getByTestId('continue-with-email'));
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
  });

  it('calls signInWithEmail with the entered credentials', async () => {
    signIn.mockResolvedValue({ session: { access_token: 't' } });
    const { getByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId('continue-with-email'));
    fireEvent.changeText(getByTestId('email-input'), 'a@b.com');
    fireEvent.changeText(getByTestId('password-input'), 'hunter22');
    fireEvent.press(getByTestId('email-submit'));
    await waitFor(() =>
      expect(signIn).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'hunter22',
      })
    );
  });

  it('switches to sign-up mode and calls signUpWithEmail with name', async () => {
    signUp.mockResolvedValue({ session: null });
    const { getByTestId, getByText } = render(<SignIn />);
    fireEvent.press(getByTestId('continue-with-email'));
    fireEvent.press(getByText(/create account/i));
    fireEvent.changeText(getByTestId('name-input'), 'Mochi');
    fireEvent.changeText(getByTestId('email-input'), 'a@b.com');
    fireEvent.changeText(getByTestId('password-input'), 'hunter22');
    fireEvent.press(getByTestId('email-submit'));
    await waitFor(() =>
      expect(signUp).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'hunter22',
        name: 'Mochi',
      })
    );
  });

  it('renders the auth-lib error message on submit failure', async () => {
    signIn.mockRejectedValue(new Error('Invalid login credentials'));
    const { getByTestId, findByText } = render(<SignIn />);
    fireEvent.press(getByTestId('continue-with-email'));
    fireEvent.changeText(getByTestId('email-input'), 'a@b.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrong');
    fireEvent.press(getByTestId('email-submit'));
    expect(await findByText('Invalid login credentials')).toBeTruthy();
  });
});
