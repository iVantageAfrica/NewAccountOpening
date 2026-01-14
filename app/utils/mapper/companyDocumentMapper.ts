export const companyDocumentMapper = (userFormData: any, accountNumber: string) => {
    const formData = new FormData();
    formData.append("account_number", accountNumber);
    const referees = [
        {
            name: userFormData.referee1Name,
            email_address: userFormData.referee1Email,
            mobile_number: userFormData.referee1Mobile,
            phone_number: userFormData.referee1Phone ?? "",
        },
        {
            name: userFormData.referee2Name,
            email_address: userFormData.referee2Email,
            mobile_number: userFormData.referee2Mobile,
            phone_number: userFormData.referee2Phone ?? "",
        },
    ];

    referees.forEach((referee, index) => {
        Object.entries(referee).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(`referee[${index}][${key}]`, value);
            }
        });
    });
    const fileFields = [
        "cac",
        "memart",
        "cac_co2",
        "cac_co7",
        "board_resolution",
        "declaration_form",
        "partnership_resolution",
        "proprietor_declaration",
        "signatory_mandate",
        "partnership_deed",
        "tin",
        "society_resolution",
        "principal_list",
        "constitution",
        "trustee_list",
        "trust_deed",
        "trustee_resolution",
        "nipc_certificate",
        "business_permit",
        "due_diligence",
    ];

    fileFields.forEach((field) => {
        if (userFormData[field] instanceof File) {
            formData.append(field, userFormData[field]);
        }
    });

    return formData;
};