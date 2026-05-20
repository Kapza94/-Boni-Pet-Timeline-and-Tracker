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

module.exports = withNativeWind(config, { input: './global.css' });
