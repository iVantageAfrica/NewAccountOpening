

export const directorySignatoryMapper = <
  T extends Record<string, File | null>
>(
  userFormData: T,
  id: string,
  type: string,
  optionalFilesData?: Record<string, File | null>
) => {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("directorySignatoryId", id);

  (Object.keys(userFormData) as (keyof T)[]).forEach((key) => {
    const value = userFormData[key];
    if (value instanceof File) {
      formData.append(key as string, value);
    }
  });

  if (optionalFilesData) {
    Object.entries(optionalFilesData).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });
  }

  return formData;
};