import { z } from "zod";

export const createAdminSchema = z.object({
    firstname: z.string().min(1, "Firstname cannot be empty").max(100, "Firstname is too long"),
    lastname: z.string().min(1, "Lastname cannot be empty").max(100, "Lastname is too long"),
    email: z.string().email("Enter a valid email address").max(100, "Email address is too long"),
    role: z.string().min(1, "Role is required"),
});

export type CreateAdminSchema = z.infer<typeof createAdminSchema>;

export const updateAdminSchema = z.object({
    firstname: z.string().min(1, "Firstname cannot be empty").max(100, "Firstname is too long"),
    lastname: z.string().min(1, "Lastname cannot be empty").max(100, "Lastname is too long"),
    email: z.string().email("Enter a valid email address").max(100, "Email address is too long"),
    role: z.string().min(1, "Role is required"),
});

export type UpdateAdminSchema = z.infer<typeof updateAdminSchema>;

export const changeAdminPasswordSchema = z.object({
    current_password: z.string().min(1, "Current password is required").max(100, "Password is too long"),
    password: z.string()
        .min(7, "Password must be at least 7 characters")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/\d/, "Password must contain at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")
        .max(100, "Password is too long"),
    password_confirmation: z.string().min(1, "Confirm your new password").max(100, "Password is too long"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
});

export type ChangeAdminPasswordSchema = z.infer<typeof changeAdminPasswordSchema>;