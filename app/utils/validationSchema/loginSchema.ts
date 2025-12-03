import { z } from "zod";

export const loginSchema = z.object({
    email : z.string().email("Email address cannot be empty"),
    password :  z.string().min(1, "Password cannot be empty")
})
export type LoginSchema = z.infer<typeof loginSchema>;

