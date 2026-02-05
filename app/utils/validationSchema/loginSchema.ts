import { z } from "zod";

export const loginSchema = z.object({
    email : z.string().email("Email address cannot be empty").max(100, "Email address is too long"),
    password :  z.string().min(1, "Password cannot be empty").max(100, "Password is too long"),
})
export type LoginSchema = z.infer<typeof loginSchema>;

