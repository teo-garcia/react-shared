/// <reference types="vite/client" />

/**
 * Vite environment variable type declarations
 * This file provides type safety for import.meta.env in Vite-based projects
 */

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly MODE: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}



