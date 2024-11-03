module.exports = {
  parser: '@typescript-eslint/parser', // Use @typescript-eslint/parser for TypeScript
  extends: [
    'plugin:react/recommended', // React recommended rules
    'plugin:@typescript-eslint/recommended', // TypeScript recommended rules
  ],
  plugins: ['import', 'react', '@typescript-eslint'], // Include the TypeScript plugin
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    requireConfigFile: false,
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the react version
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // Disable the rule
  },
};
