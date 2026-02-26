import { z } from "zod";

const fileSchema = (label: string) =>
     z
    .instanceof(File, { message: `${label}` })
    .nullable()
    .refine((f) => f !== null && f.size > 0, {
      message: `${label}`,
    });

export const PosMerchantAccountSchema = z.object({
  businessSector: z.string().min(1, "Business Sector is required").max(50, "Business Sector is too long"),
  businessName: z.string().min(1, "Business Name is required").max(100, "Business Name is too long"),
  secondaryPhone: z.string().regex(/^\+?\d{8,15}$/, "Secondary Phone number is invalid"),
  businessAddress: z.string().min(1, "Business Address is required").max(150, "Business Address is too long"),
  businessEmailAddress: z.string().email("Business Email Address is invalid").max(100, "Business Email Address is too long").optional(),
  city: z.string().max(30, "City is too long").optional(),
  lga: z.string().max(30, "LGA is too long").optional(),
  state: z.string().min(1, "State is required").max(30, "State is too long"),
  cacDocument: z.instanceof(File).optional(),

  validId: fileSchema("Valid ID is required"),
  signature: fileSchema("Signature is required"),
  utilityBill: fileSchema("Utility Bill is required"),
  passportPhoto: fileSchema("Passport Photo is required"),

  debitCard: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms"),
})
