import { use } from "react";

export const referencePortalMapper = (userFormData: any) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        user_account_number: userFormData.accountHolderNumber,
        account_holder_number: userFormData.accountHolderNumber,
        account_holder_name: userFormData.accountHolderName,
        account_holder_email: userFormData.accountHolderEmailAddress,
        name: userFormData.name,
        email_address: userFormData.email,
        mobile_number: userFormData.mobile,
        account_name: userFormData.accountName,
        account_number: userFormData.accountNumber,
        account_type: userFormData.accountType,
        comment: userFormData.comment,
        address: userFormData.address,
        known_period: userFormData.knownPeriod,
        bank_name: userFormData.bankName,
    };
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("signature", userFormData.signature);
    return formData;
}