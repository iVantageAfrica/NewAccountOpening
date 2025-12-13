import { z } from "zod";
const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label}` })
   .refine(f => f.size > 0, { message: `${label}`  });

export const savingsAccountSchema = z.object({
  mothersMaidenName: z.string().min(1, "Mother's Maiden Name is required"),
  phoneNumber: z.string().regex(/^\+?\d{8,15}$/, "Phone number is invalid").optional().or(z.literal("")),
  employmentStatus: z.string().min(1, "Employment Status is required"),
  maritalStatus: z.string().min(1, "Marital Status is required"),
  houseNumber: z.string().min(1, "House Number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  nextOfKinName: z.string().min(1, "Next of Kin Name is required"),
  nextOfKinAddress: z.string().min(1, "Next of Kin Address is required"),
  nextOfKinRelationship: z.string().min(1, "Next of Kin Relationship is required"),
  nextOfKinPhone: z.string().regex(/^\+?\d{8,15}$/, "Next of Kin Phone is invalid"),

  validId: fileSchema("Valid ID is required"),
  signature: fileSchema("Signature is required"),
  utilityBill: fileSchema("Utility Bill is required"),
  passportPhoto: fileSchema("Passport Photo is required"),

  debitCard: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms"),
});