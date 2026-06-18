import { defineConfig } from 'orval'

export default defineConfig({
  drone: {
    input: {
      target: 'http://localhost:3050/api/openapi/json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api',
      schemas: 'src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      mock: false,
      clean: true,
      override: {
        mutator: {
          path: 'src/lib/custom-fetch.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          options: {
            staleTime: 30_000,
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
