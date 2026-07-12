const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Enable JSON imports
config.resolver.sourceExts = [...config.resolver.sourceExts, 'json'];

module.exports = withNativeWind(config, { input: './global.css' });
