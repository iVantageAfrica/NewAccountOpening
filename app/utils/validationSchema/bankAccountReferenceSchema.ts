import { z } from "zod";
export const bankAccountReferenceSchema = z.object({
    referee1Name: z.string().min(1, "Referee 1 Name is required").max(50),
    referee1Email: z.string().email().max(100),
    referee1Mobile: z.string().regex(/^\+?\d{8,15}$/).max(15),
    referee1Phone: z.string().max(15).optional(),

    referee2Name: z.string().min(1, "Referee 2 Name is required").max(50),
    referee2Email: z.string().email().max(100),
    referee2Mobile: z.string().regex(/^\+?\d{8,15}$/).max(15),
    referee2Phone: z.string().max(15).optional(),
});

export type BankAccountReferenceFormInputs = z.infer<typeof bankAccountReferenceSchema>;