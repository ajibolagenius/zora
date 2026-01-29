# @zora/config

Shared configuration files for the Zora monorepo.

## Usage

### ESLint

```js
// .eslintrc.js (Next.js app)
module.exports = require('@zora/config/eslint/next');

// .eslintrc.js (React Native app)
module.exports = require('@zora/config/eslint/react-native');

// .eslintrc.js (Library package)
module.exports = require('@zora/config/eslint/base');
```

### TypeScript

```json
// tsconfig.json (Next.js app)
{
  "extends": "@zora/config/typescript/nextjs"
}

// tsconfig.json (React Native app)
{
  "extends": "@zora/config/typescript/react-native"
}

// tsconfig.json (Library package)
{
  "extends": "@zora/config/typescript/base"
}
```

### Tailwind CSS

```js
// tailwind.config.js (Web app)
const sharedConfig = require('@zora/config/tailwind/web');

module.exports = {
  ...sharedConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-web/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

## Available Configurations

### ESLint
- `@zora/config/eslint/base` - Base config for all packages
- `@zora/config/eslint/next` - Next.js apps
- `@zora/config/eslint/react-native` - React Native/Expo apps

### TypeScript
- `@zora/config/typescript/base` - Base config for libraries
- `@zora/config/typescript/nextjs` - Next.js apps
- `@zora/config/typescript/react-native` - React Native/Expo apps

### Tailwind
- `@zora/config/tailwind/web` - Web apps (includes Zora design system)
