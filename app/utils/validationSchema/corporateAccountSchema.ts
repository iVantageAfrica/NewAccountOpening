import { z } from "zod";
export const CorporateAccountSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  registrationNumber: z.string().min(1, "Company registration number is required"),
  companyType: z.string().min(1, "Company Type is required"),
  signatories: z.string().min(1, "Kindly select number of signatory"),
  tin: z.string().min(1, "TIN is required"),
  address: z.string().min(1, "Business Address is Required"),
  secondaryPhone: z.string().regex(/^\+?\d{8,15}$/, "Business Phone number is invalid"),
  businessEmailAddress: z.string().email("Business Email Address is required"),
  city: z.string().optional(),
  lga: z.string().optional(),
  accountOfficer: z.string().optional(),
  state: z.string().min(1, "State is required"),
  debitCard: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms"),
  indemnityAgreement:z.boolean().refine(val => val, "You must agree to the indemnity agreement"),

  director: z
    .array(
      z.object({
        lastname: z.string().min(1, "Director lastname is required"),
        firstname: z.string().min(1, "Director firstname is required"),
        bvn: z.string().optional(),
        nin: z.string().optional(),
        emailAddress: z.string().email("Director email is required"),
        phoneNumber: z
          .string()
          .regex(/^\+?\d{8,15}$/, "Director phone number is invalid"),
      })
    )
    .min(1, "At least one director is required"),

  signatory: z
    .array(
      z.object({
        name: z.string().min(1, "Signatory name is required"),
        emailAddress: z.string().email("Signatory email is required"),
        phoneNumber: z
          .string()
          .regex(/^\+?\d{8,15}$/, "Signatory phone number is invalid"),
        bvn: z.string().optional(),
        nin: z.string().optional(),
      })
    )
    .min(1, "At least one signatory is required"),
});