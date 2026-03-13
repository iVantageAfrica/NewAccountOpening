import { z } from "zod";
const fileSchema = (label: string) =>
     z
    .instanceof(File, { message: `${label}` })
    .nullable()
    .refine((f) => f !== null && f.size > 0, {
      message: `${label}`,
    });

export const savingsAccountSchema = z.object({
  mothersMaidenName: z.string().min(1, "Mother's Maiden Name is required").max(100, "Mother's Maiden Name is too long"),
  phoneNumber: z.string().regex(/^\+?\d{8,15}$/, "Phone number is invalid").optional().or(z.literal("")),
  emailAddress: z.string().email("Invalid email address").min(1, "Email address is required").max(100, "Email address is too long"),
  employmentStatus: z.string().min(1, "Employment Status is required").max(50, "Employment Status is too long"),
  employer: z.string().min(1, "Employer Name is required").max(100, "Employer Name is too long"),
  maritalStatus: z.string().min(1, "Marital Status is required").max(20, "Marital Status is too long"),
  houseNumber: z.string().min(1, "House Number is required").max(20, "House Number is too long"),
  street: z.string().min(1, "Street is required").max(50, "Street is too long"),
  city: z.string().min(1, "City is required").max(30, "City is too long"),
  accountOfficer: z.string().max(60, "Account Officer is too long").optional(),
  state: z.string().min(1, "State is required").max(30, "State is too long"),
  lga: z.string().min(1, "Local Government is required").max(30, "Local Government is too long"),
  origin: z.string().min(1, "State of origin is required").max(30, "State of origin is too long"),
  nextOfKinName: z.string().min(1, "Next of Kin Name is required").max(100, "Next of Kin Name is too long"),
  nextOfKinAddress: z.string().min(1, "Next of Kin Address is required").max(150, "Next of Kin Address is too long"),
  nextOfKinRelationship: z.string().min(1, "Next of Kin Relationship is required").max(50, "Next of Kin Relationship is too long"),
  nextOfKinPhone: z.string().regex(/^\+?\d{8,15}$/, "Next of Kin Phone is invalid"),

  validId: fileSchema("Valid ID is required"),
  signature: fileSchema("Signature is required"),
  utilityBill: fileSchema("Utility Bill is required"),
  passportPhoto: fileSchema("Passport Photo is required"),

  debitCard: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms and agreement"),
  indemnityAgreement:z.boolean().refine(val => val, "You must agree to the indemnity agreement")
});