/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import { FileText, Upload } from "lucide-react";

interface FileUploadInputProps {
  labelName: string;
  description?: string;
  required?: boolean;
  name?: string;
  value?: File | null;
  onFormChange?: (name: string, file: File | null) => void;
  onFileChange?: (file: File | null) => void;
  inputError?: string | null;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  labelName,
  name,
  description,
  required,
  value,
  onFormChange,
  onFileChange,
  inputError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(value || null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (uploaded.size > 1 * 1024 * 1024) {
      setError("File is too large. Maximum size is 2MB.");
      setFile(null);
      return onFileChange?.(null);
    }

    setError("");
    setFile(uploaded);
    onFileChange?.(uploaded);
    if (name) onFormChange?.(name, uploaded);
  };

  const isImage = file?.type.startsWith("image/");

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700">
        {labelName} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}

      <div
        className="relative w-full border-2 border-dotted border-gray-400 rounded-md h-20 md:h-40 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {file ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm text-white text-sm font-medium text-center p-2">
            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60"
              />
            ) : (
              <div className="flex flex-col items-center">
                <FileText size={32} className="text-white/80 mb-1" />
                <p className="truncate w-40">{file.name}</p>
              </div>
            )}
            <p className="mt-2 text-xs opacity-90 font-bold">Click to upload again</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-gray-600">
            <Upload size={24} className="text-gray-400 mb-1 font-extrabold" />
            <p className="font-medium text-sm">Click to upload ID</p>
            <p className="text-xs text-gray-500">
              PDF, DOC, or Image (Max 2MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>


      {(error || inputError) && (
        <p className="text-red-500 text-xs mt-1">{error || inputError}</p>
      )}
    </div>
  );
};

export default FileUploadInput;