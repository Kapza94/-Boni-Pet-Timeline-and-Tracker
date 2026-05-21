const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure font files are treated as assets, not source.
// Default assetExts includes otf/ttf, but pin them here so the NativeWind
// wrapper doesn't shadow them.
const assetExts = new Set(config.resolver.assetExts);
['otf', 'ttf', 'woff', 'woff2'].forEach((ext) => assetExts.add(ext));
config.resolver.assetExts = Array.from(assetExts);

// And make sure those aren't also listed as sourceExts.
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => !['otf', 'ttf', 'woff', 'woff2'].includes(ext)
);

// Block test files from the Metro bundle. Expo Router treats every .tsx
// under app/ as a route, including *.test.tsx, which pulls
// @testing-library/react-native into the device bundle and trips on its
// node 'console' import. Jest uses its own resolver so this exclusion
// is bundler-only.
const existing = config.resolver.blockList;
const testPattern = /.*\.(test|spec)\.(t|j)sx?$/;
config.resolver.blockList = existing
  ? Array.isArray(existing)
    ? existing.concat(testPattern)
    : [existing, testPattern]
  : testPattern;

module.exports = withNativeWind(config, { input: './global.css' });
