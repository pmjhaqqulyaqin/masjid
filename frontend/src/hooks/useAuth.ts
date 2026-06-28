import { createAuthClient } from "better-auth/react"
import { phoneNumberClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api$/, ''),
    plugins: [
        phoneNumberClient()
    ]
})

export const { useSession, signIn, signUp, signOut } = authClient;
