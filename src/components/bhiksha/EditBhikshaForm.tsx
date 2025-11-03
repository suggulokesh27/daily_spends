"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { bhikshaService } from "@/lib/bhikshaService";

interface EditBhikshaFormProps {
  bhiksha: any;
  onSaved: () => void;
  onCancel: () => void;
}

interface BhikshaFormValues {
  name: string;
  donated: number;
  bhiksha_date: string;
  note?: string;
}

export default function EditBhikshaForm({ bhiksha, onSaved, onCancel }: EditBhikshaFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BhikshaFormValues>({
    defaultValues: {
      name: bhiksha.name,
      donated: bhiksha.donated,
      bhiksha_date: bhiksha.bhiksha_date.slice(0, 10),
      note: bhiksha.note || "",
    },
  });

  useEffect(() => {
    reset({
      name: bhiksha.name,
      donated: bhiksha.donated,
      bhiksha_date: bhiksha.bhiksha_date.slice(0, 10),
      note: bhiksha.note || "",
    });
  }, [bhiksha, reset]);

  const onSubmit = async (data: BhikshaFormValues) => {
    const result = await bhikshaService.update(bhiksha.id, data);
    if (result.error) alert(result.error);
    else onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Bhiksha</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Name */}
          <div>
            <label className="block mb-1">Name</label>
            <input {...register("name", { required: "Name is required" })} className="w-full p-2 rounded border" />
            {errors.name?.message && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1">Date</label>
            <input type="date" {...register("bhiksha_date", { required: "Date is required" })} className="w-full p-2 rounded border" />
            {errors.bhiksha_date?.message && <p className="text-red-500 text-sm">{errors.bhiksha_date.message}</p>}
          </div>

          {/* Donated */}
          <div>
            <label className="block mb-1">Donated Amount</label>
            <input type="number" step="0.01" {...register("donated", { required: "Amount is required", valueAsNumber: true })} className="w-full p-2 rounded border" />
            {errors.donated?.message && <p className="text-red-500 text-sm">{errors.donated.message}</p>}
          </div>

          {/* Note */}
          <div>
            <label className="block mb-1">Note</label>
            <textarea {...register("note")} className="w-full p-2 rounded border" rows={3} />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
