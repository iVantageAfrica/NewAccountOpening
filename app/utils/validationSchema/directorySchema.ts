import { z } from "zod";


const fileSchema = (label: string) =>
    z
        .instanceof(File, { message: `${label}` })
        .nullable()
        .refine((f) => f !== null && f.size > 0, {
            message: `${label}`,
        });


export const directorySchema = z.object({
    signature: fileSchema("Signature is required"),
    valid_id: fileSchema("Valid ID is required"),
    passport: fileSchema("Passport photography is required"),
})
