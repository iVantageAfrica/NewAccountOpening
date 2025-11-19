import { z } from "zod";
const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label}` })
    .refine(f => f.size > 0, { message: `${label}` });

export const CorporateAccountSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  registrationNumber: z.string().min(1, "Company registration number is required"),
  companyType: z.string().min(1, "Company Type is required"),
  tin: z.string().min(1, "TIN is required"),
  address:  z.string().min(1,"Business Address is Required"),
  secondaryPhone: z.string().regex(/^\+?\d{8,15}$/, "Business Phone number is invalid"),
  businessEmailAddress: z.string().email("Business Email Address is required"),
  city: z.string().optional(),
  lga: z.string().optional(),
  accountOfficer: z.string().optional(),
  state: z.string().min(1, "State is required"),
  cacDocument: z.instanceof(File).optional(),
  debitCard: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms"),

 referee1Name: z.string().min(1, "Referee 1 Name is required"),
  referee1Email: z.string().email("Invalid email for Referee 1"),
  referee1Mobile: z.string().regex(/^\+?\d{8,15}$/, "Referee 1 Mobile is invalid"),
  referee1Phone: z.string().optional(),

  referee2Name: z.string().min(1, "Referee 2 Name is required"),
  referee2Email: z.string().email("Invalid email for Referee 2"),
  referee2Mobile: z.string().regex(/^\+?\d{8,15}$/, "Referee 2 Mobile is invalid"),

  director: z.array(
  z.object({
    lastname: z.string().min(1, "Director lastname is required"),
    firstname: z.string().min(1, "Director firstname is required"),
    bvn: z.string().min(1, "Director BVN is required"),
  })
).min(1, "At least one director is required"),

  signatory: z.array(
    z.object({
      name: z.string().min(1, "Signatory Name is required"),
      validId: fileSchema("Valid ID is required"),
      signature: fileSchema("Signature is required"),
      utilityBill: fileSchema("Utility Bill is required"),
      passportPhoto: fileSchema("Passport Photo is required"),
    })
  ).min(1, "At least one signatory is required")
});