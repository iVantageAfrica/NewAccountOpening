export const savingsAccountMapper = (userFormData: any, bvn: string) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        bvn: bvn,
        account_type_id: '2',
        mother_maiden_name: userFormData.mothersMaidenName,
        phone_number: userFormData.phoneNumber,
        employment_status: userFormData.employmentStatus,
        employer: userFormData.employer,
        marital_status: userFormData.maritalStatus,
        house_number: userFormData.houseNumber,
        street: userFormData.street,
        city: userFormData.city,
        state: userFormData.state,
        origin: userFormData.origin,
        lga: userFormData.lga,
        account_officer: userFormData.accountOfficer,
        next_of_kin_name: userFormData.nextOfKinName,
        next_of_kin_phone_number: userFormData.nextOfKinPhone,
        next_of_kin_address: userFormData.nextOfKinAddress,
        next_of_kin_relationship: userFormData.nextOfKinRelationship,
        debit_card: String(userFormData.debitCard),
    };

    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("valid_id", userFormData.validId);
    formData.append("signature", userFormData.signature);
    formData.append("utility_bill", userFormData.utilityBill);
    formData.append("passport", userFormData.passportPhoto);

    return formData;
}