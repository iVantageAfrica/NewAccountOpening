import { z } from "zod";
const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label}` })
   .refine(f => f.size > 0, { message: `${label}`  });

export const accountReferenceCreationSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    email: z.string().email("Invalid email for Referee 1").max(100, "Email is too long"),
    mobile: z.string().regex(/^\+?\d{8,15}$/, "Invalid phone number").max(15, "Phone Number is too long"),
    bankName: z.string().min(1, "Bank Name is required").max(50, "Bank Name is too long"),
    accountName: z.string().min(1, "Account Name is required").max(50, "Account Name is too long"),
    accountType: z.string().min(1, "Account Type is required").max(20, "Account Type is too long"),
    signature: fileSchema("Signature is required"),
    accountNumber: z.string().min(1, "Account Number is required").max(10, "Invalid Account Number"),
})
