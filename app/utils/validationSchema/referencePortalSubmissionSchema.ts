import { z } from "zod";
const fileSchema = (label: string) =>
     z
    .instanceof(File, { message: `${label}` })
    .nullable()
    .refine((f) => f !== null && f.size > 0, {
      message: `${label}`,
    });


export const referencePortalSubmissionSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    email: z.string().email("Invalid email for Referee 1").max(100, "Email is too long"),
    mobile: z.string().regex(/^\+?\d{8,15}$/, "Invalid phone number").max(15, "Phone Number is too long"),
    bankName: z.string().min(1, "Bank Name is required").max(100, "Bank Name is too long"),
    accountName: z.string().min(1, "Account Name is required").max(100, "Account Name is too long"),
    accountType: z.string().min(1, "Account Type is required").max(20, "Account Type is too long"),
    signature: fileSchema("Signature is required"),
    address:z.string().min(1, "Address is required").max(200, "Address is too long"),
    knownPeriod: z.string().min(1, "Known Period is required").max(50, "Known Period is too long"),
    comment: z.string().min(1, "Comment is required").max(1000, "Comment is too long"),
    accountNumber: z.string().min(1, "Account Number is required").max(10, "Invalid Account Number"),
    accountHolderNumber: z.string().min(1, "Account Holder Number is required").max(10, "Invalid Account Number"),
    accountHolderName: z.string().min(1, "Account Holder Name is required").max(100, "Account HolderName is too long"),
    accountHolderEmailAddress: z.string().max(100, "Account Holder Email Address is too long").optional(),
})


