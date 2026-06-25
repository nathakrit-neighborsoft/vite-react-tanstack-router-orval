import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: './.orval-spec.json',
      filters: { tags: ['drones'] },
    },
    output: {
      mode: 'tags-split',
      target: 'src/lib/api/generated',
      schemas: 'src/lib/api/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      mock: false,
      override: {
        mutator: { path: 'src/lib/api/mutator.ts', name: 'customInstance' },
        query: { useInfinite: false, options: {} },
      },
    },
    hooks: { afterAllFilesWrite: 'prettier --write' },
  },
})
