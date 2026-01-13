export const corporateAccountMapper = (
    userData: any,
    bvn: string,
    accountTypeId: string
) => {
    return {
        bvn,
        account_type_id: Number(accountTypeId),

        company_name: userData.companyName,
        registration_number: userData.registrationNumber,
        company_type_id: Number(userData.companyType),
        tin: userData.tin,
        address: userData.address,
        phone_number: userData.secondaryPhone,
        business_email: userData.businessEmailAddress,
        city: userData.city,
        lga: userData.lga,
        state: userData.state,
        account_officer: userData.accountOfficer,
        debit_card: userData.debitCard,

        director: userData.director.map((d: any) => ({
            lastname: d.lastname,
            firstname: d.firstname,
            bvn: d.bvn,
            nin: d.nin,
            email_address: d.emailAddress,
            phone_number: d.phoneNumber,
        })),

        signatory: userData.signatory.map((s: any) => ({
            name: s.name,
            email_address: s.emailAddress,
            phone_number: s.phoneNumber,
            bvn: s.bvn,
            nin: s.nin,
        })),
    };
};