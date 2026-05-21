import { render } from '@testing-library/react-native';

jest.mock('../../hooks/useSession', () => ({
  useSession: jest.fn(),
}));

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }: { href: string }) => <Text>redirect:{href}</Text>,
  };
});

import { useSession } from '../../hooks/useSession';
import Index from '../../app/index';

const session = useSession as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Index router', () => {
  it('renders nothing while session is loading', () => {
    session.mockReturnValue({ isLoading: true, isSignedIn: false, user: null });
    const { queryByText } = render(<Index />);
    expect(queryByText(/redirect:/)).toBeNull();
  });

  it('redirects to /(auth)/sign-in when there is no session', () => {
    session.mockReturnValue({ isLoading: false, isSignedIn: false, user: null });
    const { getByText } = render(<Index />);
    expect(getByText('redirect:/(auth)/sign-in')).toBeTruthy();
  });

  it('redirects to onboarding when signed in but onboarded_at is null', () => {
    session.mockReturnValue({
      isLoading: false,
      isSignedIn: true,
      user: { onboarded_at: null },
    });
    const { getByText } = render(<Index />);
    expect(getByText('redirect:/(onboarding)/step-1-splash')).toBeTruthy();
  });

  it('redirects to Today (tabs) when onboarded', () => {
    session.mockReturnValue({
      isLoading: false,
      isSignedIn: true,
      user: { onboarded_at: '2026-05-21T00:00:00Z' },
    });
    const { getByText } = render(<Index />);
    expect(getByText('redirect:/(app)/(tabs)')).toBeTruthy();
  });
});
