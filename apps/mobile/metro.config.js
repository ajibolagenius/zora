// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require('path');
const { FileStore } = require('metro-cache');

const config = getDefaultConfig(__dirname);

// Use a stable on-disk store (shared across web/android)
const root = process.env.METRO_CACHE_ROOT || path.join(__dirname, '.metro-cache');
config.cacheStores = [
  new FileStore({ root: path.join(root, 'cache') }),
];

// Optimize workers based on CPU count (but cap at 4 for better performance)
const os = require('os');
config.maxWorkers = Math.min(os.cpus().length || 2, 4);

// Enable transformer optimizations
config.transformer = {
  ...config.transformer,
  // Enable minification in production
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    ecma: 8,
    keep_classnames: true,
    keep_fnames: true,
    module: true,
    mangle: {
      module: true,
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  // Optimize asset handling
  assetPlugins: config.transformer?.assetPlugins || [],
};

// Optimize resolver for faster module resolution
config.resolver = {
  ...config.resolver,
  // Enable source map support for better debugging
  sourceExts: [...(config.resolver?.sourceExts || []), 'jsx', 'js', 'ts', 'tsx', 'json'],
  // Optimize asset extensions
  assetExts: config.resolver?.assetExts?.filter((ext) => ext !== 'svg') || [],
};

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: "./global.css" });
