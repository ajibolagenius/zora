/**
 * ESLint configuration for React Native/Expo apps
 * Extends base config with React Native specific rules
 */
const baseConfig = require('./base');

module.exports = {
    ...baseConfig,
    extends: [
        ...baseConfig.extends,
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: [...(baseConfig.plugins || []), 'react', 'react-hooks'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        'react-native/react-native': true,
    },
    rules: {
        ...baseConfig.rules,
        // React specific
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // React Native specific
        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: 'react-native',
                        importNames: ['StyleSheet'],
                        message: 'Use NativeWind/Tailwind classes instead of StyleSheet',
                    },
                ],
            },
        ],
    },
};
