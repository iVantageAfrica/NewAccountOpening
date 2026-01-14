import { z } from "zod";

const requiredFile = (label: string) =>
  z
    .union([z.instanceof(File), z.null()])
    .refine(file => file instanceof File, { message: `${label} is required` });

export const directorySignatorySchema = z.object({
    proof_of_address: requiredFile("Proof of Address"),
    signature: requiredFile("Signature"),
    passport: requiredFile("Passport"),
});



export const alwaysRequiredFields = [
  { name: "signature", label: "Signature", description: "Upload a copy of your signature" },
  { name: "passport", label: "Passport Photograph", description: "Upload a copy of your passport photograph" },
  { name: "proof_of_address", label: "Proof of residential Address", description: "Upload a proof of your residential address" },
];

export const optionalFieldsMapping: Record<string, Array<{ name: string; label: string; description: string }>> = {
  "1": [
    { name: "specimen_signature", label: "Specimen Signature Card", description: "Upload a copy of your specimen signature" },
    { name: "mode_of_operation", label: "Mode of Operation", description: "Upload a copy of your business mode of operation" },
  ],
    "3": [
    { name: "specimen_signature", label: "Specimen Signature Card", description: "Upload a copy of your specimen signature" },
    { name: "mode_of_operation", label: "Mode of Operation", description: "Upload a copy of your business mode of operation" },
  ],
  "8": [
    { name: "specimen_signature", label: "Specimen Signature Card", description: "Upload a copy of your specimen signature" },
    { name: "mode_of_operation", label: "Mode of Operation", description: "Upload a copy of your business mode of operation" },
  ],
  "6": [
    { name: "partnership_deed", label: "Signing authority per partnership deed", description: "Upload a copy of the signing authority per partnership deed" },
    { name: "mode_of_operation", label: "Mode of Operation", description: "Upload a copy of your business mode of operation" },
  ],
  "7": [
    { name: "joint_mandate", label: "Joint Signatory Mandate", description: "Upload a copy of your joint signatory mandate" },
    { name: "mode_of_operation", label: "Mode of Operation", description: "Upload a copy of your business mode of operation" },
  ],
  "2": [
    { name: "board_approve", label: "Board-approved signing mandate", description: "Upload a copy of your board-approved signing mandate" },
    { name: "mode_of_operation", label: "Mode of Operation", description: "Upload a copy of your business mode of operation" },
  ],
  "5": [
    { name: "board_approve", label: "Board-approved signing mandate", description: "Upload a copy of your board-approved signing mandate" },
  ],
};


export const getSignatoryFields = (businessTypeId: string) => {
  const optionalFields = optionalFieldsMapping[businessTypeId] || [];
  return [...alwaysRequiredFields, ...optionalFields];
};