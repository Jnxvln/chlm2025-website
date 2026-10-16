// This file can be used to add references for global types like `vite/client`.

// Add global `vite/client` types. For more info, see: https://vitejs.dev/guide/features#client-types
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public site origin, e.g. https://example.com (no trailing slash). See src/lib/site.ts. */
  readonly PUBLIC_SITE_ORIGIN?: string;
}
