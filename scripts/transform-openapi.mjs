/**
 * Fetches OpenAPI spec from the backend, transforms @elysiajs/openapi
 * artifacts to OAS 3.0 compliant JSON, and writes to .orval-spec.json.
 *
 * Uses VITE_API_URL from .env.local as the backend base URL.
 */
import { writeFileSync } from 'node:fs';

const DEFAULT_BASE_URL = 'http://localhost:3050';
const SCHEMAS_REF_PREFIX = '#/components/schemas/';
const AUTH_ROUTES = ['/api/auth', '/api/auth/*'];
const DATE_TIME_TYPE = { type: 'string', format: 'date-time' };

const isDateType = (s) => s?.type === 'Date';
const isNullType = (s) => s?.type === 'null';

const baseUrl = (process.env.VITE_API_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
const specUrl = `${baseUrl}/api/openapi/json`;

const res = await fetch(specUrl);
if (!res.ok) {
  console.error(`Failed to fetch spec from ${specUrl}: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const spec = await res.json();

for (const path of AUTH_ROUTES) {
  delete spec.paths?.[path];
}

const cleanSchema = (node) => {
  if (node === null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(cleanSchema);

  // @elysiajs/openapi emits bare schema names instead of $ref URIs
  if (typeof node.$ref === 'string' && !node.$ref.startsWith('#')) {
    node.$ref = SCHEMAS_REF_PREFIX + node.$ref;
  }

  // TypeBox $id leaks into the OpenAPI output
  delete node.$id;

  // TypeBox t.Date() generates anyOf with { type: "Date" } — not valid OAS 3.0
  if (node.anyOf?.some(isDateType)) return { ...DATE_TIME_TYPE };

  // OAS 3.0 rejects { type: "null" } — convert to nullable: true
  if (node.anyOf) {
    const nonNull = node.anyOf.filter((s) => !isNullType(s));
    const hasNullMember = nonNull.length < node.anyOf.length;

    if (hasNullMember && nonNull.length === 1) {
      return { ...cleanSchema(nonNull[0]), nullable: true };
    }
    if (hasNullMember) {
      return { anyOf: nonNull.map(cleanSchema), nullable: true };
    }
  }

  if (isDateType(node)) return { ...DATE_TIME_TYPE };

  for (const key of Object.keys(node)) {
    node[key] = cleanSchema(node[key]);
  }
  return node;
};

cleanSchema(spec);

writeFileSync('.orval-spec.json', JSON.stringify(spec));
console.log(`✓ Spec fetched from ${specUrl} → .orval-spec.json`);
