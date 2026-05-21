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
import { requestEmailOtp, verifyEmailOtp } from '../../lib/auth';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { text } from '../../theme/typography';
import { colors, radii, spacing } from '../../theme/tokens';

type Phase = 'pick' | 'email-request' | 'email-verify';

export default function SignIn() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('pick');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const google = useGoogleSignIn();
  const displayedError = error ?? google.errorMessage;

  const sendCode = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await requestEmailOtp(email.trim());
      setPhase('email-verify');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await verifyEmailOtp(email.trim(), code.trim());
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
              {phase === 'email-verify'
                ? `We sent a 6-digit code to ${email}. Pop it in below.`
                : "Sign in to keep your pet's timeline in sync across every device in your household."}
            </Text>
          </View>

          {phase === 'pick' ? (
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
                label={google.status === 'in-flight' ? 'Working…' : 'Continue with Google'}
                onPress={google.promptGoogleSignIn}
                disabled={!google.isReady || google.status === 'in-flight'}
              />
              <ProviderButton
                testID="continue-with-email"
                icon="Mail"
                label="Continue with email"
                onPress={() => setPhase('email-request')}
              />
            </View>
          ) : null}

          {phase === 'email-request' ? (
            <EmailRequestForm
              email={email}
              onEmailChange={setEmail}
              onSendCode={sendCode}
              onBack={() => {
                setPhase('pick');
                setError(null);
              }}
              submitting={submitting}
            />
          ) : null}

          {phase === 'email-verify' ? (
            <EmailVerifyForm
              code={code}
              onCodeChange={setCode}
              onVerify={verifyCode}
              onResend={async () => {
                setCode('');
                await sendCode();
              }}
              onChangeEmail={() => {
                setPhase('email-request');
                setCode('');
                setError(null);
              }}
              submitting={submitting}
            />
          ) : null}

          {displayedError ? (
            <Glass strength="strong" radius="md" style={{ padding: spacing[3] }}>
              <Text style={[text.bodyOnGlass, { textAlign: 'center' }]}>
                {displayedError}
              </Text>
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

function EmailRequestForm(props: {
  email: string;
  onEmailChange: (v: string) => void;
  onSendCode: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const { email, onEmailChange, onSendCode, onBack, submitting } = props;
  return (
    <View style={{ gap: spacing[3] }}>
      <Glass strength="strong" radius="lg" style={{ padding: spacing[4], gap: spacing[3] }}>
        <Field
          testID="email-input"
          label="Email"
          value={email}
          onChange={onEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <PrimaryButton
          testID="send-code"
          label={submitting ? 'Sending…' : 'Send 6-digit code'}
          onPress={onSendCode}
          disabled={submitting || !email.trim()}
        />
      </Glass>
      <Press onPress={onBack}>
        <Text style={[text.meta, { textAlign: 'center' }]}>Use a different method</Text>
      </Press>
    </View>
  );
}

function EmailVerifyForm(props: {
  code: string;
  onCodeChange: (v: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onChangeEmail: () => void;
  submitting: boolean;
}) {
  const { code, onCodeChange, onVerify, onResend, onChangeEmail, submitting } = props;
  return (
    <View style={{ gap: spacing[3] }}>
      <Glass strength="strong" radius="lg" style={{ padding: spacing[4], gap: spacing[3] }}>
        <Field
          testID="code-input"
          label="6-digit code"
          value={code}
          onChange={onCodeChange}
          keyboardType="number-pad"
          autoCapitalize="none"
        />
        <PrimaryButton
          testID="verify-code"
          label={submitting ? 'Verifying…' : 'Verify code'}
          onPress={onVerify}
          disabled={submitting || code.trim().length < 6}
        />
      </Glass>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing[4] }}>
        <Press onPress={onResend}>
          <Text style={text.meta}>Resend code</Text>
        </Press>
        <Press onPress={onChangeEmail}>
          <Text style={text.meta}>Change email</Text>
        </Press>
      </View>
    </View>
  );
}

function PrimaryButton({
  testID,
  label,
  onPress,
  disabled,
}: {
  testID: string;
  label: string;
  onPress: () => void;
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
          backgroundColor: colors.emerald[500],
          borderColor: colors.glassBorder.strong,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Text style={[text.row, { color: '#fff', textAlign: 'center' }]}>{label}</Text>
      </Glass>
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
  keyboardType?: 'default' | 'email-address' | 'number-pad';
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
