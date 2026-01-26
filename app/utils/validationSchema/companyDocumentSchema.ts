import { z } from "zod";

const fileOptional = z.instanceof(File).optional().nullable();

const baseSchema = z.object({
    referee1Name: z.string().min(1, "Referee 1 Name is required"),
    referee1Email: z.string().email("Invalid Referee 1 Email"),
    referee1Mobile: z.string().regex(/^\+?\d{8,15}$/, "Referee 1 Mobile is invalid"),

    referee2Name: z.string().min(1, "Referee 2 Name is required"),
    referee2Email: z.string().email("Invalid Referee 2 Email"),
    referee2Mobile: z.string().regex(/^\+?\d{8,15}$/, "Referee 2 Mobile is invalid"),

    cac: fileOptional,
    memart: fileOptional,
    cac_co2: fileOptional,
    cac_co7: fileOptional,
    board_resolution: fileOptional,
    declaration_form: fileOptional,
    property_declaration: fileOptional,
    signatory_mandate: fileOptional,
    partnership_deed: fileOptional,
    partnership_resolution: fileOptional,
    tin: fileOptional,
    constitution: fileOptional,
    society_resolution: fileOptional,
    principal_list: fileOptional,
    trust_deed: fileOptional,
    trustee_resolution: fileOptional,
    trustee_list: fileOptional,
    nipc_certificate: fileOptional,
    business_permit: fileOptional,
    due_diligence: fileOptional,
});

export const buildCompanyDocumentSchema = (accountTypeId: number) =>
    baseSchema.superRefine((data, ctx) => {
        const requiredDocs = ACCOUNT_TYPE_DOCUMENTS[accountTypeId] || [];

        requiredDocs.forEach((doc) => {
            if (!data[doc]) {
                ctx.addIssue({
                    path: [doc],
                   message: `${doc.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} is required`,
                    code: z.ZodIssueCode.custom,
                });
            }
        });
    });

export type CompanyDocumentPayload = z.infer<typeof baseSchema>;


export const ACCOUNT_TYPE_DOCUMENTS: Record<number, string[]> = {
    1: ["cac", "memart", "cac_co2", "cac_co7", "board_resolution", "declaration_form"],
    2: ["cac", "property_declaration", "signatory_mandate"],
    3: ["cac", "partnership_deed", "partnership_resolution", "tin"],
    4: ["cac", "constitution", "society_resolution", "principal_list"],
    5: ["cac", "trust_deed", "trustee_resolution", "trustee_list"],
    6: ["cac", "nipc_certificate", "business_permit", "cac_co2", "due_diligence"],
     7: ["cac", "memart", "cac_co2", "cac_co7", "board_resolution", "declaration_form"],
      8: ["cac", "memart", "cac_co2", "cac_co7", "board_resolution", "declaration_form"],
};

export const DOCUMENT_META: Record<
    string,
    { label: string; description: string }
> = {
    cac: { label: "CAC Certificate", description: "Upload CAC document" },
    memart: { label: "MEMART", description: "Memorandum & Articles of Association" },
    cac_co2: { label: "CAC CO2", description: "Shareholders form" },
    cac_co7: { label: "CAC CO7", description: "Directors form" },
    board_resolution: { label: "Board Resolution", description: "Authorize account opening" },
    declaration_form: { label: "UBO Declaration", description: "Declaration form" },
    property_declaration: { label: "Proprietor Declaration", description: "Proprietor declaration" },
    signatory_mandate: { label: "Signatory Mandate", description: "Authorization letter" },
    partnership_deed: { label: "Partnership Deed", description: "Partnership deed" },
    partnership_resolution: { label: "Partnership Resolution", description: "Partners resolution" },
    tin: { label: "TIN", description: "Tax Identification Number" },
    constitution: { label: "Constitution", description: "Organization constitution" },
    society_resolution: { label: "Society Resolution", description: "Society resolution" },
    principal_list: { label: "Principal Officers", description: "List of principal officers" },
    trust_deed: { label: "Trust Deed", description: "Trust deed document" },
    trustee_resolution: { label: "Trustee Resolution", description: "Trustee resolution" },
    trustee_list: { label: "Trustee List", description: "List of trustees" },
    nipc_certificate: { label: "NIPC Certificate", description: "NIPC certificate" },
    business_permit: { label: "Business Permit", description: "Business permit" },
    due_diligence: { label: "Due Diligence", description: "Enhanced due diligence" },
};