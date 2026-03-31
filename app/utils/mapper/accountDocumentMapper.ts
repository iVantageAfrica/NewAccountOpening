import { use } from "react";

export const accountDocumentMapper = (userFormData: any, userAccountNumber: string) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        account_number: userAccountNumber,
    };
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("signature", userFormData.signature);
    formData.append("utility_bill", userFormData.utilityBill);
    formData.append("valid_id", userFormData.validId);
    formData.append("passport", userFormData.passport);
    return formData;
}