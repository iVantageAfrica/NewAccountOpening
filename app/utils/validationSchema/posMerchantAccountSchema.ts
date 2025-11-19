import { z } from "zod";

const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label}` })
    .refine(f => f.size > 0, { message: `${label}` });

export const PosMerchantAccountSchema = z.object({
  businessSector: z.string().min(1, "Business Sector is required"),
  businessName: z.string().min(1, "Business Name is required"),
  secondaryPhone: z.string().regex(/^\+?\d{8,15}$/, "Secondary Phone number is invalid"),
  businessAddress: z.string().min(1, "Business Address is required"),
  businessEmailAddress: z.string().optional(),
  city: z.string().optional(),
  lga: z.string().optional(),
  state: z.string().min(1, "State is required"),
  cacDocument: z.instanceof(File).optional(),

  validId: fileSchema("Valid ID is required"),
  signature: fileSchema("Signature is required"),
  utilityBill: fileSchema("Utility Bill is required"),
  passportPhoto: fileSchema("Passport Photo is required"),

  debitCard: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms"),
})
