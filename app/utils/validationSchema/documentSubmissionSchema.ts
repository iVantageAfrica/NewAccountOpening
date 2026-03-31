import { z } from "zod";
const fileSchema = (label: string) =>
     z
    .instanceof(File, { message: `${label}` })
    .nullable()
    .refine((f) => f !== null && f.size > 0, {
      message: `${label}`,
    });


export const accountDocumentSubmissionSchema = z.object({
    signature: fileSchema("Signature is required"),
    utilityBill: fileSchema("Utility Bill is required"),
    validId: fileSchema("Valid ID is required"),
    passport: fileSchema("Passport is required"),
})
