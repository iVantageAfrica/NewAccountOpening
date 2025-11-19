import { email } from "zod";

export const posAccountMapper = (userFormData: any, bvn: string) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        bvn: bvn,
        account_type_id: '4',
        business_sector: userFormData.businessSector,
        business_name: userFormData.businessName,
        phone_number: userFormData.secondaryPhone,
        business_address: userFormData.businessAddress,
        email_address:userFormData.businessEmailAddress,
        city: userFormData.city,
        lga: userFormData.lga,
        state: userFormData.state,
        debit_card: String(userFormData.debitCard),
    };

    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("valid_id", userFormData.validId);
    formData.append("signature", userFormData.signature);
    formData.append("utility_bill", userFormData.utilityBill);
    formData.append("passport", userFormData.passportPhoto);
    formData.append("cac", userFormData.cacDocument)

    return formData;
}