import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/services/userauth/auth"

export const { GET, POST } = toNextJsHandler(auth)