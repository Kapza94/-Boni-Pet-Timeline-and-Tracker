import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('../../lib/auth', () => ({
  requestEmailOtp: jest.fn(),
  verifyEmailOtp: jest.fn(),
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

import { requestEmailOtp, verifyEmailOtp } from '../../lib/auth';
import SignIn from '../../app/(auth)/sign-in';

const request = requestEmailOtp as jest.Mock;
const verify = verifyEmailOtp as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignIn screen — passwordless OTP', () => {
  it('reveals the email input when "Continue with email" is pressed', () => {
    const { queryByTestId, getByTestId } = render(<SignIn />);
    expect(queryByTestId('email-input')).toBeNull();
    fireEvent.press(getByTestId('continue-with-email'));
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('send-code')).toBeTruthy();
  });

  it('sends the OTP and advances to the code entry step', async () => {
    request.mockResolvedValue(undefined);
    const { getByTestId, findByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId('continue-with-email'));
    fireEvent.changeText(getByTestId('email-input'), 'a@b.com');
    fireEvent.press(getByTestId('send-code'));
    await waitFor(() => expect(request).toHaveBeenCalledWith('a@b.com'));
    expect(await findByTestId('code-input')).toBeTruthy();
  });

  it('verifies the entered code via verifyEmailOtp', async () => {
    request.mockResolvedValue(undefined);
    verify.mockResolvedValue({ session: { access_token: 't' } });
    const { getByTestId, findByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId('continue-with-email'));
    fireEvent.changeText(getByTestId('email-input'), 'a@b.com');
    fireEvent.press(getByTestId('send-code'));
    await findByTestId('code-input');
    fireEvent.changeText(getByTestId('code-input'), '123456');
    fireEvent.press(getByTestId('verify-code'));
    await waitFor(() =>
      expect(verify).toHaveBeenCalledWith('a@b.com', '123456')
    );
  });

  it('shows the OTP error message when verification fails', async () => {
    request.mockResolvedValue(undefined);
    verify.mockRejectedValue(new Error('Token has expired or is invalid'));
    const { getByTestId, findByTestId, findByText } = render(<SignIn />);
    fireEvent.press(getByTestId('continue-with-email'));
    fireEvent.changeText(getByTestId('email-input'), 'a@b.com');
    fireEvent.press(getByTestId('send-code'));
    await findByTestId('code-input');
    fireEvent.changeText(getByTestId('code-input'), '000000');
    fireEvent.press(getByTestId('verify-code'));
    expect(await findByText('Token has expired or is invalid')).toBeTruthy();
  });

  it('surfaces a send-OTP error from requestEmailOtp', async () => {
    request.mockRejectedValue(new Error('Email rate limit exceeded'));
    const { getByTestId, findByText } = render(<SignIn />);
    fireEvent.press(getByTestId('continue-with-email'));
    fireEvent.changeText(getByTestId('email-input'), 'a@b.com');
    fireEvent.press(getByTestId('send-code'));
    expect(await findByText('Email rate limit exceeded')).toBeTruthy();
  });
});
