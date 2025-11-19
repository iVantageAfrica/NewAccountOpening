export const corporateAccountMapper = (userFormData: any, bvn: string) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        bvn,
        account_type_id: '3',
        company_name: userFormData.companyName,
        registration_number: userFormData.registrationNumber,
        company_type: userFormData.companyType,
        tin: userFormData.tin,
        address: userFormData.address,
        phone_number: userFormData.secondaryPhone,
        business_email: userFormData.businessEmailAddress,
        city: userFormData.city,
        lga: userFormData.lga,
        state: userFormData.state,
        account_officer: userFormData.accountOfficer,
        debit_card: String(userFormData.debitCard),
    };

    const referees = [
        {
            name: userFormData.referee1Name,
            email_address: userFormData.referee1Email,
            mobile_number: userFormData.referee1Mobile,
            phone_number: userFormData.referee1Phone,
        },
        {
            name: userFormData.referee2Name,
            email_address: userFormData.referee2Email,
            mobile_number: userFormData.referee2Mobile,
            phone_number: userFormData.referee2Phone,
        },
    ];

    referees.forEach((ref, index) => {
        Object.entries(ref).forEach(([key, value]) => {
            formData.append(`referee[${index}][${key}]`, value as string);
        });
    });

    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));

    if (userFormData.cacDocument) {
        formData.append("cac", userFormData.cacDocument);
    }

    userFormData.signatory.forEach((s: any, idx: number) => {
        formData.append(`signatory[${idx}][name]`, s.name);
        formData.append(`signatory[${idx}][valid_id]`, s.validId);
        formData.append(`signatory[${idx}][signature]`, s.signature);
        formData.append(`signatory[${idx}][utility_bill]`, s.utilityBill);
        formData.append(`signatory[${idx}][passport]`, s.passportPhoto);
    });

    userFormData.director.forEach((d: any, idx: number) => {
        formData.append(`director[${idx}][lastname]`, d.lastname);
        formData.append(`director[${idx}][firstname]`, d.firstname);
        formData.append(`director[${idx}][bvn]`, d.bvn);
    });

    return formData;
};