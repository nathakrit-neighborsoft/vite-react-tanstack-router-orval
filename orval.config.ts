import { defineConfig } from 'orval'

export default defineConfig({
  drone: {
    input: {
      target: 'http://localhost:3050/api/openapi/json',
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
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
