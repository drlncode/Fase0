/// <reference types="vite/client" />
import { RelativeTimeElement } from '@github/relative-time-element'

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'relative-time': React.DetailedHTMLProps<React.HTMLAttributes<RelativeTimeElement>, RelativeTimeElement> & 
            Partial<Omit<RelativeTimeElement, keyof HTMLElement>>
        }
    }
}

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_WS_URL: string
    readonly VITE_API_TIMEOUT: number
    readonly VITE_CHATS_PER_PAGE: number
    readonly VITE_MESSAGES_PER_PAGE: number
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
