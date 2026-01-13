import { z } from "zod";
const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label}` })
   .refine(f => f.size > 0, { message: `${label}`  });

export const bankAccountReferenceSubmissionSchema = z.object({
    bankName: z.string().min(1, "Bank Name is required"),
    accountName: z.string().min(1, "Account Name is required"),
    accountType: z.string().min(1, "Account Type is required"),
    signature: fileSchema("Signature is required"),
    accountNumber: z.string().min(1, "Account Number is required").max(10, "Invalid Account Number"),
})
