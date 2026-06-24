import { Elysia } from 'elysia'
import 'reflect-metadata'
import './lib/config/dayjs.config'
declare const app: Elysia<
  '',
  {
    decorator: {}
    store: {}
    derive: {}
    resolve: {}
  },
  {
    typebox: {}
    error: {}
  } & {
    typebox: {}
    error: {}
  } & {
    typebox: {}
    error: {}
  } & {
    typebox: {
      readonly drone: import('@sinclair/typebox').TObject<{
        id: import('@sinclair/typebox').TNumber
        company: import('@sinclair/typebox').TString
        model: import('@sinclair/typebox').TString
        fullName: import('@sinclair/typebox').TString
        priceRTF: import('@sinclair/typebox').TNumber
        tankCapacity: import('@sinclair/typebox').TNumber
        flightSpeed: import('@sinclair/typebox').TNumber
        sprayWidth: import('@sinclair/typebox').TNumber
        coveragePerDay: import('@sinclair/typebox').TNumber
        rtfEquipment: import('@sinclair/typebox').TString
      }>
      readonly droneCreateInput: import('@sinclair/typebox').TObject<{
        company: import('@sinclair/typebox').TString
        model: import('@sinclair/typebox').TString
        fullName: import('@sinclair/typebox').TString
        priceRTF: import('@sinclair/typebox').TNumber
        tankCapacity: import('@sinclair/typebox').TNumber
        flightSpeed: import('@sinclair/typebox').TNumber
        sprayWidth: import('@sinclair/typebox').TNumber
        coveragePerDay: import('@sinclair/typebox').TNumber
        rtfEquipment: import('@sinclair/typebox').TString
      }>
      readonly droneUpdateInput: import('@sinclair/typebox').TObject<{
        company: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString>
        model: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString>
        fullName: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString>
        priceRTF: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
        tankCapacity: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
        flightSpeed: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
        sprayWidth: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
        coveragePerDay: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
        rtfEquipment: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString>
      }>
    }
    error: {}
  } & {
    typebox: import('@sinclair/typebox').TModule<{}>
    error: {}
  },
  {
    schema: {}
    standaloneSchema: {}
    macro: {}
    macroFn: {}
    parser: {}
    response: {}
  } & {
    schema: {}
    standaloneSchema: {}
    macro: {}
    macroFn: {}
    parser: {}
    response: {}
  } & {
    schema: {}
    standaloneSchema: {}
    macro: {}
    macroFn: {}
    parser: {}
    response: {}
  } & {
    schema: {}
    macro: {}
    macroFn: {}
    parser: {}
  },
  {
    api: {
      auth: {
        '*': {
          [x: string]: {
            body: unknown
            params: {
              '*': string
            } & {}
            query: unknown
            headers: unknown
            response: {
              200: Response
              422: {
                type: 'validation'
                on: string
                summary?: string
                message?: string
                found?: unknown
                property?: string
                expected?: string
              }
            }
          }
        }
      }
    }
  } & {
    api: {
      auth: {
        [x: string]: {
          body: unknown
          params: {}
          query: unknown
          headers: unknown
          response: {
            200: Response
          }
        }
      }
    }
  } & {
    api: {}
  } & {
    api: {
      drone: {
        get: {
          body: unknown
          params: {}
          query: unknown
          headers: unknown
          response: {
            200: {
              id: number
              company: string
              model: string
              fullName: string
              priceRTF: number
              tankCapacity: number
              flightSpeed: number
              sprayWidth: number
              coveragePerDay: number
              rtfEquipment: string
            }[]
            422: {
              type: 'validation'
              on: string
              summary?: string
              message?: string
              found?: unknown
              property?: string
              expected?: string
            }
          }
        }
      }
    } & {
      drone: {
        ':id': {
          get: {
            body: unknown
            params: {
              id: string
            } & {}
            query: unknown
            headers: unknown
            response: {
              200: {
                id: number
                company: string
                model: string
                fullName: string
                priceRTF: number
                tankCapacity: number
                flightSpeed: number
                sprayWidth: number
                coveragePerDay: number
                rtfEquipment: string
              }
              422: {
                type: 'validation'
                on: string
                summary?: string
                message?: string
                found?: unknown
                property?: string
                expected?: string
              }
            }
          }
        }
      }
    } & {
      drone: {
        post: {
          body: {
            company: string
            model: string
            fullName: string
            priceRTF: number
            tankCapacity: number
            flightSpeed: number
            sprayWidth: number
            coveragePerDay: number
            rtfEquipment: string
          }
          params: {}
          query: unknown
          headers: unknown
          response: {
            200: {
              id: number
              company: string
              model: string
              fullName: string
              priceRTF: number
              tankCapacity: number
              flightSpeed: number
              sprayWidth: number
              coveragePerDay: number
              rtfEquipment: string
            }
            422: {
              type: 'validation'
              on: string
              summary?: string
              message?: string
              found?: unknown
              property?: string
              expected?: string
            }
          }
        }
      }
    } & {
      drone: {
        ':id': {
          patch: {
            body: {
              company?: string | undefined
              model?: string | undefined
              fullName?: string | undefined
              priceRTF?: number | undefined
              tankCapacity?: number | undefined
              flightSpeed?: number | undefined
              sprayWidth?: number | undefined
              coveragePerDay?: number | undefined
              rtfEquipment?: string | undefined
            }
            params: {
              id: string
            } & {}
            query: unknown
            headers: unknown
            response: {
              200: {
                id: number
                company: string
                model: string
                fullName: string
                priceRTF: number
                tankCapacity: number
                flightSpeed: number
                sprayWidth: number
                coveragePerDay: number
                rtfEquipment: string
              }
              422: {
                type: 'validation'
                on: string
                summary?: string
                message?: string
                found?: unknown
                property?: string
                expected?: string
              }
            }
          }
        }
      }
    } & {
      drone: {
        ':id': {
          delete: {
            body: unknown
            params: {
              id: string
            } & {}
            query: unknown
            headers: unknown
            response: {
              200: {
                success: true
              }
              422: {
                type: 'validation'
                on: string
                summary?: string
                message?: string
                found?: unknown
                property?: string
                expected?: string
              }
            }
          }
        }
      }
    }
  } & {
    [x: string]: {
      get: {
        body: unknown
        params: {}
        query: unknown
        headers: unknown
        response: {
          200: string
        }
      }
    }
  },
  {
    derive: {}
    resolve: {}
    schema: {}
    standaloneSchema: {}
    response: {}
  },
  {
    derive: {}
    resolve: {}
    schema: {}
    standaloneSchema: {}
    response: {
      [x: string]: {
        [x: string]: any
      }
    }
  } & {
    derive: {}
    resolve: {}
    schema: {}
    standaloneSchema: {}
    response: {}
  } & {
    derive: {}
    resolve: {}
    schema: {}
    standaloneSchema: {}
    response: {}
  } & {
    derive: {}
    resolve: {}
    schema: {}
  }
>
export { app }
export type App = typeof app
