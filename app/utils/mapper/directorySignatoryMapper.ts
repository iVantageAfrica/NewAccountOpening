export const directorySignatoryMapper = (userFormData: any, id: string, type: string) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("directorySignatoryId", id);

    const optionalFiles = [
        "signature",
        "passport",
        "valid_id",
        "proof_of_address",
        "specimen_signature",
        "partnership_deed",
        "mode_of_operation",
        "joint_mandate",
        "board_approve"
    ];

    optionalFiles.forEach((field) => {
        if (userFormData[field] instanceof File) {
            formData.append(field, userFormData[field]);
        }
    });

    Object.entries(userFormData).forEach(([key, value]) => {
        if (!optionalFiles.includes(key) && value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    return formData;
};