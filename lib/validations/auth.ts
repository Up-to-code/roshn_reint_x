import * as z from "zod"

// Export schemas from centralized location
export { LoginSchema, RegisterSchema } from "@/schemas"

// For backward compatibility, keep userAuthSchema as LoginSchema
export { LoginSchema as userAuthSchema } from "@/schemas"
