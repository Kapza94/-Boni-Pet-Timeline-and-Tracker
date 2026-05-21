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

// Block test files + jest-only libraries from the Metro bundle. Expo
// Router treats every .tsx under app/ as a route, including
// *.test.tsx, which would pull @testing-library/react-native into the
// device bundle and trip on its node 'console' import. We also block
// the testing libraries themselves as a belt-and-suspenders guard in
// case any prod import sneaks in. Jest uses its own resolver so these
// exclusions are bundler-only.
const exclusions = [
  /.*\.(test|spec)\.(t|j)sx?$/,
  /node_modules\/@testing-library\/.*/,
  /node_modules\/jest(-[a-z-]+)?\/.*/,
];
const existing = config.resolver.blockList;
config.resolver.blockList = existing
  ? (Array.isArray(existing) ? existing : [existing]).concat(exclusions)
  : exclusions;

module.exports = withNativeWind(config, { input: './global.css' });
