import pluginObject from 'eslint-plugin-prettier'

export default [
  {
    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
      curly: 'error',
      'prefer-const': 'error',
    },
    plugins: {
      prettier: pluginObject,
    },
    ignores: ['**/*.config.js'],
  },
]
