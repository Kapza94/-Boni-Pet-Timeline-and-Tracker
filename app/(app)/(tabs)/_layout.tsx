import { Tabs } from 'expo-router';

// Placeholder — F07 replaces this with the floating glass capsule tab bar
// and the center + FAB.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#080b13' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="meds" options={{ title: 'Meds' }} />
      <Tabs.Screen name="timeline" options={{ title: 'Timeline' }} />
      <Tabs.Screen name="family" options={{ title: 'Family' }} />
    </Tabs>
  );
}
