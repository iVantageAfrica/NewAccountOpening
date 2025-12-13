import { z } from "zod";
export const bankAccountReferenceSchema = z.object({
    referee1Name: z.string().min(1, "Referee 1 Name is required"),
    referee1Email: z.string().email("Invalid email for Referee 1"),
    referee1Mobile: z.string().regex(/^\+?\d{8,15}$/, "Referee 1 Mobile is invalid"),
    referee1Phone: z.string().optional(),

    referee2Name: z.string().min(1, "Referee 2 Name is required"),
    referee2Email: z.string().email("Invalid email for Referee 2"),
    referee2Mobile: z.string().regex(/^\+?\d{8,15}$/, "Referee 2 Mobile is invalid"),
    referee2Phone: z.string().optional(),
})
  .transform((data) => ({
    referee: [
      {
        name: data.referee1Name,
        email_address: data.referee1Email,
        mobile_number: data.referee1Mobile,
        phone_number: data.referee1Phone ?? null,
      },
      {
        name: data.referee2Name,
        email_address: data.referee2Email,
        mobile_number: data.referee2Mobile,
        phone_number: data.referee2Phone ?? null,
      },
    ],
  }));

export type BankAccountReferencePayload = z.infer<typeof bankAccountReferenceSchema>;