/**
 * ESLint configuration for Next.js apps
 * Extends base config with React and Next.js specific rules
 */
const baseConfig = require('./base');

module.exports = {
    ...baseConfig,
    extends: [
        ...baseConfig.extends,
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'next/core-web-vitals',
    ],
    plugins: [...(baseConfig.plugins || []), 'react', 'react-hooks'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        ...baseConfig.rules,
        // React specific
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Next.js specific
        '@next/next/no-html-link-for-pages': 'error',
    },
};
