import { defineConfig } from 'orval'

export default defineConfig({
  drone: {
    input: {
      target: './openapi.json',
      filters: {
        tags: ['Drone'],
      },
    },
    output: {
      mode: 'tags-split',
      target: 'src/api',
      schemas: 'src/api/model',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      clean: true,
      override: {
        mutator: {
          path: './src/lib/http-client.ts',
          name: 'httpClient',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
