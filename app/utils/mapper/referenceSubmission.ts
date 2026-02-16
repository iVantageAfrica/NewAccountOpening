import { use } from "react";

export const referenceSubmissionMapper = (userFormData: any, refereeId: string) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        referee_id: refereeId,
        account_name: userFormData.accountName,
        account_number: userFormData.accountNumber,
        account_type: userFormData.accountType,
        bank_name: userFormData.bankName,
        known_period: userFormData.knownPeriod,
        comment: userFormData.comment,
    };
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("signature", userFormData.signature);
    return formData;
}