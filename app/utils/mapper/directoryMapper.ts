import { use } from "react";

export const directoryMapper = (userFormData: any, directoryId: string) => {
    const formData = new FormData();

    const fields: Record<string, any> = {
        directory_id: directoryId,
    };
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("signature", userFormData.signature);
    formData.append("valid_id", userFormData.valid_id);
    formData.append("passport", userFormData.passport);
    return formData;
}