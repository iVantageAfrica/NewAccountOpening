import { z } from "zod";
export const CorporateAccountSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(100, "Company name is too long"),
  registrationNumber: z.string().min(1, "Company registration number is required").max(50, "Company registration number is too long"),
  companyType: z.string().min(1, "Company Type is required").max(50, "Company Type is too long"),
  signatories: z.string().min(1, "Kindly select number of signatory"),
  tin: z.string().min(1, "TIN / NIN is required").max(50, "TIN / NIN  is too long"),
  address: z.string().min(1, "Business Address is Required").max(150, "Business Address is too long"),
  secondaryPhone: z.string().regex(/^\+?\d{8,15}$/, "Business Phone number is invalid"),
  businessEmailAddress: z.string().email("Business Email Address is required").max(100, "Business Email Address is too long"),
  city: z.string().max(20, "City is too long").optional(),
  lga: z.string().max(30, "LGA is too long").optional(),
  accountOfficer: z.string().max(100, "Account Officer is too long").optional(),
  state: z.string().min(1, "State is required").max(20, "State is too long"),
  debitCard: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms"),
  indemnityAgreement:z.boolean().refine(val => val, "You must agree to the indemnity agreement"),

  director: z
    .array(
      z.object({
        lastname: z.string().min(1, "Director lastname is required").max(50, "Director lastname is too long"),
        firstname: z.string().min(1, "Director firstname is required").max(50, "Director firstname is too long"),
        bvn: z.string().max(12, "BVN is too long").optional(),
        nin: z.string().max(12, "NIN is too long").optional(),
        emailAddress: z.string().email("Director email is required").max(100, "Director email is too long"),
        phoneNumber: z
          .string()
          .regex(/^\+?\d{8,15}$/, "Director phone number is invalid"),
      })
    )
    .min(1, "At least one director is required"),

  signatory: z
    .array(
      z.object({
        name: z.string().min(1, "Signatory name is required").max(100, "Signatory name is too long"),
        emailAddress: z.string().email("Signatory email is required").max(100, "Signatory email is too long"),
        phoneNumber: z
          .string()
          .regex(/^\+?\d{8,15}$/, "Signatory phone number is invalid"),
        bvn: z.string().max(12, "BVN is too long").optional(),
        nin: z.string().max(12, "NIN is too long").optional(),
      })
    )
    .min(1, "At least one signatory is required"),
});