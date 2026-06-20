import { Elysia } from 'elysia';
import 'reflect-metadata';
import './lib/dayjs-config';
import './modules/drone/drone.module';
declare const app: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {};
    error: {};
} & {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly drone: import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TString;
            brand: import("@sinclair/typebox").TString;
            model: import("@sinclair/typebox").TString;
            fullName: import("@sinclair/typebox").TString;
            imageUrl: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            priceThb: import("@sinclair/typebox").TNumber;
            tankCapacityL: import("@sinclair/typebox").TNumber;
            speedMps: import("@sinclair/typebox").TNumber;
            sprayWidthM: import("@sinclair/typebox").TNumber;
            performanceRaiPerDay: import("@sinclair/typebox").TNumber;
        }>;
        readonly droneCreateInput: import("@sinclair/typebox").TObject<{
            brand: import("@sinclair/typebox").TString;
            model: import("@sinclair/typebox").TString;
            fullName: import("@sinclair/typebox").TString;
            priceThb: import("@sinclair/typebox").TNumber;
            tankCapacityL: import("@sinclair/typebox").TNumber;
            speedMps: import("@sinclair/typebox").TNumber;
            sprayWidthM: import("@sinclair/typebox").TNumber;
            performanceRaiPerDay: import("@sinclair/typebox").TNumber;
        }>;
        readonly droneUpdateInput: import("node_modules/@sinclair/typebox/build/esm/type/computed/computed.mjs").TComputed<"Partial", [import("@sinclair/typebox").TRef<"droneCreateInput">]>;
    };
    error: {};
} & {
    typebox: import("@sinclair/typebox").TModule<{}>;
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
} & {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
    api: {
        auth: {
            "*": {
                [x: string]: {
                    body: unknown;
                    params: {
                        "*": string;
                    } & {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    api: {
        auth: {
            [x: string]: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: Response;
                };
            };
        };
    };
} & {
    api: {};
} & {
    api: {
        drone: {
            get: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: {
                        id: string;
                        brand: string;
                        model: string;
                        fullName: string;
                        imageUrl: string | null;
                        priceThb: number;
                        tankCapacityL: number;
                        speedMps: number;
                        sprayWidthM: number;
                        performanceRaiPerDay: number;
                    }[];
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    } & {
        drone: {
            ":id": {
                get: {
                    body: unknown;
                    params: {
                        id: string;
                    } & {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            id: string;
                            brand: string;
                            model: string;
                            fullName: string;
                            imageUrl: string | null;
                            priceThb: number;
                            tankCapacityL: number;
                            speedMps: number;
                            sprayWidthM: number;
                            performanceRaiPerDay: number;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    } & {
        drone: {
            post: {
                body: {
                    brand: string;
                    model: string;
                    fullName: string;
                    priceThb: number;
                    tankCapacityL: number;
                    speedMps: number;
                    sprayWidthM: number;
                    performanceRaiPerDay: number;
                };
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: {
                        id: string;
                        brand: string;
                        model: string;
                        fullName: string;
                        imageUrl: string | null;
                        priceThb: number;
                        tankCapacityL: number;
                        speedMps: number;
                        sprayWidthM: number;
                        performanceRaiPerDay: number;
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    } & {
        drone: {
            ":id": {
                patch: {
                    body: unknown;
                    params: {
                        id: string;
                    } & {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            id: string;
                            brand: string;
                            model: string;
                            fullName: string;
                            imageUrl: string | null;
                            priceThb: number;
                            tankCapacityL: number;
                            speedMps: number;
                            sprayWidthM: number;
                            performanceRaiPerDay: number;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    } & {
        drone: {
            ":id": {
                delete: {
                    body: unknown;
                    params: {
                        id: string;
                    } & {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            success: true;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    [x: string]: {
        get: {
            body: unknown;
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                200: string;
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {
        [x: string]: {
            [x: string]: any;
        };
    };
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
} & {
    derive: {};
    resolve: {};
    schema: {};
}>;
export { app };
export type App = typeof app;
