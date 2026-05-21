import { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AmbientCanvas } from '../../components/AmbientCanvas';
import { Glass } from '../../components/Glass';
import { Press } from '../../components/Press';
import { Eyebrow } from '../../components/Eyebrow';
import { SerifTitle } from '../../components/SerifTitle';
import { LIcon } from '../../components/icons/LIcon';
import { signInWithEmail, signUpWithEmail } from '../../lib/auth';
import { text } from '../../theme/typography';
import { colors, radii, spacing } from '../../theme/tokens';

type Mode = 'pick' | 'email';
type EmailIntent = 'sign-in' | 'sign-up';

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('pick');
  const [intent, setIntent] = useState<EmailIntent>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (intent === 'sign-up') {
        await signUpWithEmail({ email, password, name });
      } else {
        await signInWithEmail({ email, password });
      }
      router.replace('/');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas.deep }}>
      <AmbientCanvas />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: spacing[5],
            justifyContent: 'center',
            gap: spacing[6],
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: spacing[2] }}>
            <Eyebrow>Welcome to Boni</Eyebrow>
            <SerifTitle size="hero" italic>
              Every day, every memory.
            </SerifTitle>
            <Text style={text.body}>
              Sign in to keep your pet&apos;s timeline in sync across every
              device in your household.
            </Text>
          </View>

          {mode === 'pick' ? (
            <View style={{ gap: spacing[3] }}>
              <ProviderButton
                testID="continue-with-apple"
                icon="Apple"
                label="Continue with Apple"
                disabled
              />
              <ProviderButton
                testID="continue-with-google"
                icon="Globe"
                label="Continue with Google"
                disabled
              />
              <ProviderButton
                testID="continue-with-email"
                icon="Mail"
                label="Continue with email"
                onPress={() => setMode('email')}
              />
            </View>
          ) : (
            <EmailForm
              intent={intent}
              onIntentChange={setIntent}
              name={name}
              onNameChange={setName}
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              onSubmit={submit}
              submitting={submitting}
              onBack={() => {
                setMode('pick');
                setError(null);
              }}
            />
          )}

          {error ? (
            <Glass strength="strong" radius="md" style={{ padding: spacing[3] }}>
              <Text style={[text.bodyOnGlass, { textAlign: 'center' }]}>{error}</Text>
            </Glass>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ProviderButton({
  testID,
  icon,
  label,
  onPress,
  disabled,
}: {
  testID: string;
  icon: 'Apple' | 'Globe' | 'Mail';
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Press testID={testID} onPress={onPress} disabled={disabled}>
      <Glass
        radius="pill"
        strength="strong"
        style={{
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <LIcon name={icon} size="row" surface="glass" />
        <Text style={[text.row, { color: colors.onGlass[1], flex: 1, textAlign: 'center' }]}>
          {label}
        </Text>
      </Glass>
    </Press>
  );
}

function EmailForm(props: {
  intent: EmailIntent;
  onIntentChange: (i: EmailIntent) => void;
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const {
    intent,
    onIntentChange,
    name,
    onNameChange,
    email,
    onEmailChange,
    password,
    onPasswordChange,
    onSubmit,
    onBack,
    submitting,
  } = props;
  return (
    <View style={{ gap: spacing[3] }}>
      <Glass strength="strong" radius="lg" style={{ padding: spacing[4], gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <SegmentButton
            label="Sign in"
            selected={intent === 'sign-in'}
            onPress={() => onIntentChange('sign-in')}
          />
          <SegmentButton
            label="Create account"
            selected={intent === 'sign-up'}
            onPress={() => onIntentChange('sign-up')}
          />
        </View>

        {intent === 'sign-up' ? (
          <Field
            testID="name-input"
            label="Your name"
            value={name}
            onChange={onNameChange}
            autoCapitalize="words"
          />
        ) : null}

        <Field
          testID="email-input"
          label="Email"
          value={email}
          onChange={onEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field
          testID="password-input"
          label="Password"
          value={password}
          onChange={onPasswordChange}
          secureTextEntry
        />

        <Press testID="email-submit" onPress={onSubmit} disabled={submitting}>
          <Glass
            radius="pill"
            strength="strong"
            style={{
              paddingVertical: spacing[3],
              paddingHorizontal: spacing[4],
              backgroundColor: colors.emerald[500],
              borderColor: colors.glassBorder.strong,
            }}
          >
            <Text style={[text.row, { color: '#fff', textAlign: 'center' }]}>
              {submitting
                ? 'Working…'
                : intent === 'sign-up'
                ? 'Create account'
                : 'Sign in'}
            </Text>
          </Glass>
        </Press>
      </Glass>

      <Press onPress={onBack}>
        <Text style={[text.meta, { textAlign: 'center' }]}>Use a different method</Text>
      </Press>
    </View>
  );
}

function SegmentButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Press onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          paddingVertical: spacing[2],
          borderRadius: radii.pill,
          backgroundColor: selected ? colors.glass.strong : 'transparent',
          borderWidth: 1,
          borderColor: selected ? colors.glassBorder.DEFAULT : 'transparent',
          alignItems: 'center',
        }}
      >
        <Text
          style={[
            text.meta,
            { color: selected ? colors.onGlass[1] : colors.onGlass[3] },
          ]}
        >
          {label}
        </Text>
      </View>
    </Press>
  );
}

function Field({
  testID,
  label,
  value,
  onChange,
  autoCapitalize,
  keyboardType,
  secureTextEntry,
}: {
  testID: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
}) {
  return (
    <View style={{ gap: spacing[1] }}>
      <Eyebrow onGlass>{label}</Eyebrow>
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChange}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: colors.glassBorder.DEFAULT,
          borderRadius: radii.md,
          padding: spacing[3],
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          color: colors.onGlass[1],
          fontFamily: 'SFProDisplay-Regular',
          fontSize: 16,
        }}
      />
    </View>
  );
}
