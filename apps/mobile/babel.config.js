module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind', unstable_transformImportMeta: true }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@zora/api-client': '../../packages/api-client',
            '@zora/types': '../../packages/types',
            '@zora/design-tokens': '../../packages/design-tokens',
            '@zora/ui-web': '../../packages/ui-web',
          },
        },
      ],
    ],
  };
};
