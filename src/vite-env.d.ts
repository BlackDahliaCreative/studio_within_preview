/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** "preview" or "official", from the env file of the build mode */
    readonly VITE_SITE_ENV: string
    /** Preview builds: the preview site's address, used for share links. Empty otherwise. */
    readonly VITE_SHARE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
