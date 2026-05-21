import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientCanvas } from '../components/AmbientCanvas';
import { Glass } from '../components/Glass';
import { BoniNavBar } from '../components/BoniNavBar';
import { Eyebrow } from '../components/Eyebrow';
import { SerifTitle } from '../components/SerifTitle';
import { LIcon } from '../components/icons/LIcon';
import { Avatar } from '../components/Avatar';
import { AvatarStack } from '../components/AvatarStack';
import { Sheet } from '../components/Sheet';
import { Press } from '../components/Press';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { text } from '../theme/typography';
import { colors, spacing } from '../theme/tokens';

/**
 * F01 kitchen sink — every primitive on one screen so we can visually
 * QA the design system before Today (F05) starts consuming it. This
 * screen is throwaway; it goes once Today is the natural canary.
 */
export default function KitchenSink() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduceMotion = useReduceMotion();

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas.DEFAULT }}>
      <AmbientCanvas />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <BoniNavBar
          eyebrow="F01 · primitives"
          title="Kitchen sink"
          trailingIcon="Settings"
          onTrailing={() => setSheetOpen(true)}
        />
        <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[6] }}>
          <Section title="Typography">
            <Glass style={{ padding: spacing[4], gap: spacing[3] }}>
              <Eyebrow onGlass>Eyebrow on glass</Eyebrow>
              <SerifTitle size="hero">Every day, every memory.</SerifTitle>
              <SerifTitle size="title" italic>
                A quiet moment with Mochi.
              </SerifTitle>
              <Text style={text.bodyOnGlass}>
                Body text on glass — used inside cards, sheets, and any
                surface backed by the strong fill.
              </Text>
              <Text style={text.metaOnGlass}>Meta · 12 min ago</Text>
            </Glass>
          </Section>

          <Section title="Glass tiers">
            <View style={{ gap: spacing[3] }}>
              {(['thin', 'regular', 'strong'] as const).map((s) => (
                <Glass key={s} strength={s} style={{ padding: spacing[4] }}>
                  <Text style={text.row}>strength = {s}</Text>
                </Glass>
              ))}
            </View>
          </Section>

          <Section title="Icons">
            <Glass style={{ padding: spacing[4], flexDirection: 'row', gap: spacing[4] }}>
              <LIcon name="PawPrint" size="tab" />
              <LIcon name="Pill" size="row" />
              <LIcon name="Image" size="row" />
              <LIcon name="Users" size="row" />
              <LIcon name="CircleCheckBig" surface="active" />
            </Glass>
          </Section>

          <Section title="Avatars">
            <Glass style={{ padding: spacing[4], gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                <Avatar initials="MK" color="oklch(88% 0.10 290)" size={44} />
                <Avatar initials="SC" color="oklch(88% 0.10 25)" size={44} active />
                <Avatar initials="JT" color="oklch(88% 0.10 230)" size={44} />
              </View>
              <AvatarStack
                people={[
                  { initials: 'SC', color: 'oklch(88% 0.10 290)' },
                  { initials: 'JT', color: 'oklch(88% 0.10 25)' },
                  { initials: 'RM', color: 'oklch(88% 0.10 230)', active: true },
                ]}
              />
            </Glass>
          </Section>

          <Section title="Press feedback">
            <Press onPress={() => setSheetOpen(true)}>
              <Glass radius="pill" strength="regular" style={{ padding: spacing[4] }}>
                <Text
                  style={[
                    text.row,
                    { textAlign: 'center', color: colors.onGlass[1] as string },
                  ]}
                >
                  Tap to open sheet
                </Text>
              </Glass>
            </Press>
          </Section>

          <Section title="Accessibility">
            <Glass style={{ padding: spacing[4] }}>
              <Text style={text.row}>
                Reduce Motion: {reduceMotion ? 'on (drift parked)' : 'off (drift running)'}
              </Text>
            </Glass>
          </Section>
        </ScrollView>
      </SafeAreaView>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <SerifTitle size="title" italic style={{ marginBottom: spacing[3] }}>
          From the sheet.
        </SerifTitle>
        <Text style={text.bodyOnGlass}>
          Backdrop press closes me. Drag-to-dismiss arrives when F06
          (Quick Log) lands.
        </Text>
      </Sheet>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing[2] }}>
      <Eyebrow>{title}</Eyebrow>
      {children}
    </View>
  );
}
