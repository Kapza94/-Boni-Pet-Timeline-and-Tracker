/* eslint-env jest */
// Mocks that jest-expo doesn't cover.

// expo-blur — BlurView is purely decorative under tests; render nothing
// so the surrounding View tree remains testable without GPU.
jest.mock('expo-blur', () => ({
  __esModule: true,
  BlurView: function BlurView() {
    return null;
  },
}));

// @shopify/react-native-skia — Skia primitives also render nothing
// under tests; AmbientCanvas + memory book preview only need to mount.
jest.mock('@shopify/react-native-skia', () => {
  const passthrough = function SkiaStub() {
    return null;
  };
  return new Proxy(
    {},
    {
      get: (_t, key) => {
        if (key === '__esModule') return true;
        return passthrough;
      },
    }
  );
});

// react-native-reanimated — official Jest mock from the package.
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence warnings about useNativeDriver in animations.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

// AsyncStorage — the package ships an official Jest mock; without it
// importing lib/supabase from a component test trips the "NativeModule:
// AsyncStorage is null" error.
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
