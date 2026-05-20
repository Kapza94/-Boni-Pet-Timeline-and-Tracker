/* eslint-env jest */
// Mocks that jest-expo doesn't cover.

// expo-blur — replace BlurView with a plain View so component tests
// can render without GPU.
jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return {
    BlurView: (props: object) => View(props as never),
  };
});

// @shopify/react-native-skia — stub Canvas + primitives to no-op views
// so AmbientCanvas + future Skia code can render in jsdom.
jest.mock('@shopify/react-native-skia', () => {
  const { View } = require('react-native');
  const passthrough = (props: object) => View(props as never);
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

// @gorhom/bottom-sheet — use the package's bundled mock so the native
// sheet doesn't try to mount. Our Sheet primitive layers an
// imperative-ref override on top of this in its own test.
jest.mock('@gorhom/bottom-sheet', () => require('@gorhom/bottom-sheet/mock'));
