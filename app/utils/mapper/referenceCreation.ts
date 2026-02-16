import { use } from "react";

export const referenceCreationMapper = (userFormData: any, userAccountNumber: string) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        user_account_number: userAccountNumber,
        name: userFormData.name,
        email_address: userFormData.email,
        mobile_number: userFormData.mobile,
        account_name: userFormData.accountName,
        account_number: userFormData.accountNumber,
        account_type: userFormData.accountType,
        comment: userFormData.comment,
        known_period: userFormData.knownPeriod,
        bank_name: userFormData.bankName,
    };
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("signature", userFormData.signature);
    return formData;
}