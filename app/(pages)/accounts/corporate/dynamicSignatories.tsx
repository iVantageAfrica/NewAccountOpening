import { useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { X, Plus } from "lucide-react";
import Input from "@/app/components/ui/input";
import FileUploadInput from "@/app/components/ui/fileUpload";

interface Props {
  control: any;
  errors: any;
}

export default function DynamicSignatories({ control, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "signatory"
  });

  const [active, setActive] = useState(1);
  if (fields.length === 0) {
    append({ name: "", validId: null, signature: null, utilityBill: null, passportPhoto: null });
  }

  const addSignatory = () => {
    append({ name: "", validId: null, signature: null, utilityBill: null, passportPhoto: null });
    setActive(fields.length + 1); 
  };

  const removeSignatory = (index: number) => {
    if (index === 0) return;
    remove(index);
    if (active === index + 1) setActive(1); 
  };

  return (
    <>
      <div className="flex items-center gap-3 bg-gray-200 p-2 mb-4 overflow-x-auto">
        {fields.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setActive(idx + 1)}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded text-xs md:text-sm justify-between
              ${active === idx + 1 ? "bg-gray-300 text-black" : "hover:bg-black/20"}`}
          >
            <span>Signatory {idx + 1}</span>
            {idx !== 0 && (
              <X
                size={14}
                className="text-red-500 hover:text-black"
                onClick={e => { e.stopPropagation(); removeSignatory(idx); }}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSignatory}
          className="bg-gray-300 rounded px-3 py-2 flex items-center"
        >
          <Plus size={18} />
        </button>
      </div>

      {fields.map((field, idx) => (active === idx + 1 && (
        <div key={idx}>
          <p className="col-span-full font-bold text-sm text-black/60 ml-4 md:ml-8 italic pb-2">
            Upload documents for: Signatory {idx + 1}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 md:px-8 gap-6 md:gap-12 mx-4 md:mx-0 mb-8">
            {["validId", "signature", "utilityBill", "passportPhoto"].map((key) => (
              <Controller
                key={key}
                name={`signatory.${idx}.${key}`}
                control={control}
                render={({ field }) => (
                  <FileUploadInput
                    required
                    labelName={key.replace(/([A-Z])/g, " $1").replace(/\b\w/g, c => c.toUpperCase())}
                    inputError={errors?.signatory?.[idx]?.[key]?.message}
                    {...field}
                    onFileChange={(file) => field.onChange(file)}
                  />
                )}
              />
            ))}
          </div>

          <div className="w-full md:w-1/2 px-4 md:px-8 mb-6">
            <Controller
              name={`signatory.${idx}.name`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  required
                  labelName={`Signatory ${idx + 1} Name`}
                  inputError={errors?.signatory?.[idx]?.name?.message}
                />
              )}
            />
          </div>
        </div>
      )))}
    </>
  );
}