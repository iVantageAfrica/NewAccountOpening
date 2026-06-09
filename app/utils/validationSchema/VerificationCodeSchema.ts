import { z } from "zod";

export const VerificationCodeSchema = z.object({
    email : z.string().email("Email address cannot be empty").max(100, "Email address is too long"),
})
export type VerificationCodeSchema = z.infer<typeof VerificationCodeSchema>;



export const PasswordResetSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(100, "Password is too long"),

        confirmPassword: z
            .string()
            .min(8, "Confirm Password must be at least 8 characters long")
            .max(100, "Confirm Password is too long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type PasswordResetSchema = z.infer<typeof PasswordResetSchema>;
