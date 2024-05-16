import pluginObject from 'eslint-plugin-prettier'

export default [
  {
    plugins: {
      prettier: pluginObject,
    },
    ignores: ['**/*.config.js', '*.min.js', 'node_modules/', 'build/'],
  },
]
